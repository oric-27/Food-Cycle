package com.yno.foodcyclebackend.entity;

import com.yno.foodcyclebackend.enums.ProviderType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "food_providers")
public class FoodProvider extends BaseEntity {

    @OneToOne(fetch = FetchType.EAGER)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider_type", nullable = false)
    private ProviderType providerType;

    @Column(name = "business_name")
    private String businessName;

    private String address;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "license_document_url")
    private String licenseDocumentUrl;

    @Column(name = "registration_number")
    private String registrationNumber;

}
