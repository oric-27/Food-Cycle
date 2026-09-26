# Food Cycle backend

## Food provider API

All routes require a bearer token unless otherwise noted by the auth controller.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET`, `PUT` | `/api/food-providers/profile` | View/update business details and weekly operating/donation hours |
| `GET` | `/api/food-categories` | List food categories |
| `POST` | `/api/food-categories` | Create a category (admin only) |
| `POST` | `/api/food-providers/listings` | Create a surplus listing |
| `GET` | `/api/food-providers/listings` | List the signed-in provider's listings |
| `GET` | `/api/food-providers/listings/available` | List unexpired available food |
| `PUT`, `DELETE` | `/api/food-providers/listings/{listingId}` | Update or remove an available listing |
| `POST` | `/api/food-claims` | An approved organization requests servings; response contains its pickup OTP |
| `GET` | `/api/food-claims` | List the signed-in organization's requests |
| `POST` | `/api/food-claims/{claimId}/cancel` | Cancel a pending request |
| `GET` | `/api/food-providers/claims` | List requests for the provider |
| `PUT` | `/api/food-providers/claims/{claimId}/status` | Advance `REQUESTED -> CONFIRMED -> PREPARING -> READY_FOR_PICKUP`, or reject |
| `POST` | `/api/food-providers/claims/{claimId}/verify-pickup` | Verify OTP and complete pickup |
| `POST` | `/api/food-providers/claims/{claimId}/pickup-otp` | Rotate an OTP for an order ready for pickup |
| `GET` | `/api/food-providers/reports/impact` | Completed-order impact totals and donation/sale history |
| `POST` | `/api/admin/users/{id}/approve` | Verify an account (Food Providers need a complete business profile) |
| `POST` | `/api/admin/users/{id}/reject` | Reject account verification |

Listing payloads accept `imageUrl`, `categoryId`, and `offerType` (`DONATION` or
`DISCOUNTED_SALE`). Discounted-sale listings require a positive `priceAmount`;
donations are recorded at zero. A partial-serving sale is prorated against the
listing's `servingsEquivalent`.

`imageUrl` and `licenseDocumentUrl` are references to files already stored by an
external upload/object-storage service. This backend does not accept multipart
uploads or store files. Sale totals are recorded for reporting; no payment
gateway or currency conversion is implemented.

## Existing MySQL database upgrade

The earlier schema made `food_claims.food_listing_id` unique via a one-to-one
mapping. The current order model permits a listing to receive later requests
after rejection/cancellation. Before deploying against an existing database,
find and remove that unique index (do not remove the foreign key):

```sql
SELECT INDEX_NAME
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'food_claims'
  AND COLUMN_NAME = 'food_listing_id'
  AND NON_UNIQUE = 0;
```

Then run `ALTER TABLE food_claims DROP INDEX <INDEX_NAME>;` for the returned
unique index. Hibernate's `ddl-auto=update` adds the new nullable columns and
operating-hours table, but does not reliably remove an existing unique index.
