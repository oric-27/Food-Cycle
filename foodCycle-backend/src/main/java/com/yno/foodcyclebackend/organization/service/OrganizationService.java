package com.yno.foodcyclebackend.organization.service;

import com.yno.foodcyclebackend.organization.dao.OrganizationDao;
import com.yno.foodcyclebackend.enums.VerificationStatus;
import com.yno.foodcyclebackend.organization.dto.request.OrganizationProfileRequest;
import com.yno.foodcyclebackend.organization.dto.response.OrganizationProfileResponse;
import com.yno.foodcyclebackend.organization.entity.Organization;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Objects;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class OrganizationService {
    private static final ZoneId APP_ZONE = ZoneId.of("Asia/Yangon");

    private final OrganizationDao organizationDao;

    @Transactional
    public OrganizationProfileResponse getProfile(Authentication authentication) {
        Organization organization = new Organization();
        resetCapacityIfNewDay(organization);
        return OrganizationProfileResponse.from(organization);
    }

    @Transactional
    public OrganizationProfileResponse updateMyProfile(OrganizationProfileRequest request,
                                                       Authentication authentication) {
        Organization organization = lockByEmail(authentication.getName());
        resetCapacityIfNewDay(organization);

        String organizationName = request.getOrganizationName().trim();
        String address = request.getAddress().trim();
        String contactNumber = request.getContactNumber().trim();
        String registerNumber = request.getRegistrationNumber().trim();
        String licenseDocumentUrl = request.getLicenseDocumentUrl().trim();
        boolean identityChanged = !Objects.equals(organization.getOrganizationName(), organizationName)
                || !Objects.equals(organization.getAddress(), address)
                || !Objects.equals(organization.getContactNumber(), contactNumber)
                || !Objects.equals(organization.getRegistrationNumber(), registerNumber)
                || !Objects.equals(organization.getLicenseDocumentUrl(), licenseDocumentUrl);
        organization.setOrganizationName(organizationName);
        organization.setAddress(address);
        organization.setContactNumber(contactNumber);
        organization.setRegistrationNumber(registerNumber);
        organization.setLicenseDocumentUrl(licenseDocumentUrl);
        if (request.getDailyCapacityServings() != null) {
            updateCapacity(organization, request.getDailyCapacityServings());
        }
        if (identityChanged && organization.getUser().getVerificationStatus() == VerificationStatus.VERIFIED) {
            organization.getUser().setVerificationStatus(VerificationStatus.PENDING);
        }
        return OrganizationProfileResponse.from(organizationDao.save(organization));
    }

    @Transactional
    public OrganizationProfileResponse updateCapacity(int newDailyCapacity, Authentication authentication){
        Organization organization = lockByEmail(authentication.getName());
        resetCapacityIfNewDay(organization);
        updateCapacity(organization, newDailyCapacity);
        return OrganizationProfileResponse.from(organizationDao.save(organization));
    }

    @Transactional
    public Organization getVerifiedOrganizationForClaim(Authentication authentication) {
        Organization organization = lockByEmail(authentication.getName());
        resetCapacityIfNewDay(organization);
        if (organization.getUser().getVerificationStatus() != VerificationStatus.VERIFIED
                || !Boolean.TRUE.equals(organization.getUser().getIsActive())) {
            throw new AccessDeniedException("Organization account is not approved");
        }
        return organization;
    }

    @Transactional
    public Organization lockById(Long organizationId) {
        Organization organization = organizationDao.findByIdForUpdate(organizationId)
                .orElseThrow(() -> new ResponseStatusException(
                        NOT_FOUND,
                        "Organization profile not found"
                ));
        resetCapacityIfNewDay(organization);
        return organization;
    }

    public void reserveCapacity(Organization organization, int servings) {
        int remaining = organization.getRemainingCapacityServings();
        if (servings > remaining) {
            throw new ResponseStatusException(
                    BAD_REQUEST,
                    "Required serving exceed your remaining daily capacity of " + remaining
            );
        }
        organization.setRemainingCapacityServings(remaining - servings);
    }

    public void releaseCapacity(Organization organization, int servings, LocalDate reservationDate){
        if (!today().equals(reservationDate)) {
            return;
        }
        int dailyCapacity = dailyCapacity(organization);
        int remaining = remainingCapacity(organization);
        organization.setRemainingCapacityServings(Math.min(dailyCapacity, remaining + servings));
    }

    private Organization lockByEmail(String email) {
        return organizationDao.findByUserEmailForUpdate(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Organization profile not found"));
    }

    private void resetCapacityIfNewDay(Organization organization) {
        LocalDate today = today();
        if (organization.getCapacityResetDate() == null ||
                organization.getCapacityResetDate().isBefore(today)) {
            organization.setRemainingCapacityServings(dailyCapacity(organization));
            organization.setCapacityResetDate(today);
        }
    }

    public void updateCapacity(Organization organization, int newDailyCapacity) {
        if (newDailyCapacity < 0) {
            throw new ResponseStatusException(BAD_REQUEST, "Daily capacity cannot be negative");
        }
        int currentUsed = dailyCapacity(organization) - remainingCapacity(organization);
        if (newDailyCapacity < currentUsed) {
            throw new ResponseStatusException(
                    CONFLICT,
                    "Daily capacity cannot be lower than servings already reserved or fulfilled today (" + currentUsed + ")");
        }
        organization.setDailyCapacityServings(newDailyCapacity);
        organization.setRemainingCapacityServings(newDailyCapacity - currentUsed);
        organization.setCapacityResetDate(today());
    }

    private LocalDate today() {
        return LocalDate.now(APP_ZONE);
    }

    private int dailyCapacity(Organization organization) {
        return organization.getDailyCapacityServings() == null ? 0 : organization.getDailyCapacityServings();
    }

    private int remainingCapacity(Organization organization) {
        return organization.getRemainingCapacityServings() == null ? 0 : organization.getRemainingCapacityServings();
    }

}
