# Food Cycle

Food Cycle သည် စားသောက်ဆိုင်များနှင့် အစားအစာပိုလျှံသူများထံမှ အစားအစာကို
ကယ်တင်ပြီး လိုအပ်နေသော community organization များထံ မျှဝေပေးရန် ရည်ရွယ်သည့်
web application ဖြစ်သည်။ လက်ရှိ repository တွင် Spring Boot backend နှင့်
React frontend ပါဝင်သည်။

ဤစာတမ်းသည် လက်ရှိ code ထဲတွင် အမှန်တကယ်ရှိသော အစိတ်အပိုင်းများ၊ မပြီးသေးသော
အပိုင်းများနှင့် Volunteer feature ကို နောက်တစ်ဆင့်တွင် ဆက်လက်တည်ဆောက်ရန်
မှတ်စုများကို စုစည်းထားသည်။

## Repository ဖွဲ့စည်းပုံ

```text
foodCycle-backend/   Spring Boot REST API, MySQL persistence, security
foodCycle-react/     React + TypeScript + Vite web application
```

## နည်းပညာများ

- **Backend:** Java 25, Spring Boot 4.1.1, Spring MVC, Spring Data JPA,
  Spring Security, Jakarta Validation
- **Database:** MySQL
- **Authentication:** JWT bearer token; password များကို BCrypt ဖြင့် hash လုပ်သည်
- **Frontend:** React 19, TypeScript, Vite, React Router
- **Frontend tooling:** npm, Oxlint

## လက်ရှိ feature အခြေအနေ

### Authentication နှင့် account verification

- `FOOD_PROVIDER`, `ORGANIZATION`, `VOLUNTEER` role များဖြင့် register လုပ်နိုင်သည်။
- Login အောင်မြင်လျှင် JWT token နှင့် role များကို ပြန်ပေးသည်။
- User အသစ်များကို `PENDING` အဖြစ် စတင်သတ်မှတ်ပြီး admin က `VERIFIED` သို့မဟုတ်
  `REJECTED` ပြုလုပ်နိုင်သည်။
- Admin, provider, organization အတွက် အချို့ API များတွင် role စစ်ဆေးမှုရှိသည်။
- Frontend တွင် Food Provider နှင့် Organization login/dashboard routing ရှိသည်။
  Volunteer login/dashboard flow မပြီးသေးပါ။

### Food Provider

- Business profile နှင့် operating/donation hours ကြည့်ရှု၊ ပြင်ဆင်နိုင်သည်။
- Surplus food listing ဖန်တီး၊ ကြည့်ရှု၊ ပြင်ဆင်၊ ဖျက်နိုင်သည်။
- Listing တွင် `DONATION` သို့မဟုတ် `DISCOUNTED_SALE` သတ်မှတ်နိုင်သည်။
- Provider က claim ကို လက်ခံ၊ ပယ်ချ၊ ပြင်ဆင်နေ၊ pickup-ready အခြေအနေသို့ ပြောင်းနိုင်သည်။
- Pickup OTP စစ်ဆေးပြီး claim ကို ပြီးဆုံးစေနိုင်သည်။
- Impact/financial report API ရှိသည်။
- Frontend တွင် Provider dashboard ရှိသည်။

### Organization

- Organization profile နှင့် daily capacity အတွက် backend model, API, claim-related
  services ရှိသည်။
- အတည်ပြုပြီးသော Organization က listing ကို claim တင်နိုင်ပြီး pending claim ကို
  ပယ်ဖျက်နိုင်သည်။
- Daily capacity ကို Yangon timezone အရ နေ့စဉ် reset လုပ်ရန် scheduled task ရှိသည်။
- Claim တင်ချိန်တွင် remaining daily capacity ကို စစ်ဆေးပြီး reserve လုပ်သည်။
  Pending claim ပယ်ဖျက်ခြင်း သို့မဟုတ် provider က reject လုပ်ခြင်းတွင် capacity ကို
  reservation ပြုလုပ်သည့်နေ့တူမှသာ ပြန်လည်ဖြည့်ပေးသည်။
- Signup တွင် organization name, contact number, registration number, address,
  license URL နှင့် daily capacity ကို ဖြည့်နိုင်သည်။
- Organization profile, ရရှိနိုင်သော food, claim request/cancel နှင့် request status
  ကြည့်နိုင်သည့် frontend workspace (`/organization`) ရှိသည်။
- **မှတ်ချက်:** License file ကို backend သို့ upload မလုပ်ပါ။ ပြင်ပ file storage တွင်
  တင်ပြီး URL ကို ဖြည့်ရသည်။ Profile အထောက်အထားအချက်အလက်ပြောင်းလဲလျှင်
  re-verification အတွက် status ကို `PENDING` သို့ ပြန်ပြောင်းသည်။

### Volunteer

- `VOLUNTEER` role ဖြင့် registration ပြုလုပ်နိုင်သည်။
- Volunteer entity တွင် availability အခြေအနေရှိပြီး signup မှာ address နှင့်
  availability ကို ဖြည့်သွင်းနိုင်သည်။
- `Vehicle` နှင့် `DeliveryMission` model/DAO များလည်း ရှိသည်။
- **မပြီးသေးသောအပိုင်း:** Volunteer အတွက် REST controller/service, profile နှင့်
  vehicle စီမံခန့်ခွဲမှု API, mission assignment/status workflow, frontend route နှင့်
  dashboard မရှိသေးပါ။ Model/DAO ရှိခြင်းကို ပြီးပြည့်စုံသော Volunteer feature ဟု
  မယူဆရပါ။
- အကြံပြုသည့် နောက်တစ်ဆင့်: Volunteer လိုအပ်ချက်နှင့် mission workflow ကို
  သတ်မှတ်ပြီးမှ API, authorization, UI နှင့် tests ကို အစဉ်လိုက် တည်ဆောက်ပါ။

## Local development

### လိုအပ်ချက်များ

- Java 25
- MySQL
- Node.js နှင့် npm

### Backend

1. MySQL တွင် `foodCycle` database တစ်ခု ဖန်တီးပါ။
2. `foodCycle-backend/src/main/resources/application.properties` တွင်
   မိမိ local MySQL connection နှင့် JWT signing secret ကို သတ်မှတ်ပါ။
   Database password နှင့် JWT secret များကို source control သို့ မတင်ပါနှင့်။
3. Backend ကို စတင်ပါ။

```bash
cd foodCycle-backend
./mvnw spring-boot:run
```

Backend သည် ပုံမှန်အားဖြင့် `http://localhost:8080` တွင် run သည်။
Test များကို run ရန်:

```bash
./mvnw test
```

Spring JPA `ddl-auto=update` ကို လက်ရှိ local configuration တွင် အသုံးပြုထားသည်။
Production database migration အဖြစ် မယူဆသင့်ပါ။ Deployment မတိုင်မီ migration
နည်းလမ်း၊ database backup နှင့် schema upgrade ကို သီးခြားစီ စီစဉ်ပါ။

`DataInitializer` သည် လက်ရှိ development အတွက် default admin account တစ်ခုကို
ဖန်တီးပေးသည်။ Source ထဲတွင် သတ်မှတ်ထားသော default credential ကို production တွင်
မသုံးပါနှင့်။ Deployment မတိုင်မီ ၎င်းကို ဖယ်ရှားခြင်း သို့မဟုတ် လုံခြုံသော
configuration ဖြင့် အစားထိုးခြင်းနှင့် secret များ ပြောင်းလဲခြင်းကို လုပ်ဆောင်ပါ။

### Frontend

```bash
cd foodCycle-react
npm ci
npm run dev
```

Frontend သည် ပုံမှန်အားဖြင့် Vite local development server တွင် run သည်။
API URL မသတ်မှတ်ထားပါက frontend က `http://localhost:8080/api/auth` ကို
default အဖြစ်သုံးသည်။ `VITE_API_URL` သတ်မှတ်ပါက auth API path အပါအဝင်
API URL ကို အသုံးပြုပါ (ဥပမာ `http://localhost:8080/api/auth`)။

Frontend production build နှင့် lint:

```bash
npm run build
npm run lint
```

## API အကျဉ်းချုပ်

Backend base URL ပုံမှန်တန်ဖိုးမှာ `http://localhost:8080` ဖြစ်သည်။
`/api/auth/register` နှင့် `/api/auth/login` မှလွဲ၍ API request များအတွက်
`Authorization: Bearer <token>` လိုအပ်သည်။ Role ကန့်သတ်ချက်များကို အောက်ပါ
ဇယားတွင် ဖော်ပြထားသည်။ လက်ရှိ Security configuration သည် အခြား API များအားလုံး
authentication လိုအပ်စေပြီး controller/service အလိုက် role နှင့် ownership
စစ်ဆေးမှုများလည်း ရှိသည်။

| Method | Endpoint | လုပ်ဆောင်ချက် | အဓိကအသုံးပြုသူ |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Account ဖန်တီးရန် | Public |
| `POST` | `/api/auth/login` | ဝင်ရောက်ရန်၊ JWT ရယူရန် | Public |
| `GET` | `/api/food-categories` | Food category များ | Authenticated |
| `POST` | `/api/food-categories` | Category ဖန်တီးရန် | Admin |
| `GET`, `PUT` | `/api/food-providers/profile` | Provider profile ကြည့်/ပြင် | Food Provider |
| `POST` | `/api/food-providers/listings` | Listing ဖန်တီးရန် | Food Provider |
| `GET` | `/api/food-providers/listings` | ကိုယ်ပိုင် listing များ | Food Provider |
| `GET` | `/api/food-providers/listings/available` | ရရှိနိုင်သော listing များ | Authenticated |
| `PUT`, `DELETE` | `/api/food-providers/listings/{listingId}` | ကိုယ်ပိုင် listing ပြင်/ဖျက် | Food Provider |
| `POST` | `/api/food-claims` | Listing ကို claim တင်ရန် | Verified Organization |
| `GET` | `/api/food-claims` | ကိုယ့် claim များကြည့်ရန် | Organization |
| `POST` | `/api/food-claims/{claimId}/cancel` | Pending claim ပယ်ဖျက်ရန် | Organization |
| `GET` | `/api/food-providers/claims` | Provider listing အပေါ် claim များ | Food Provider |
| `PUT` | `/api/food-providers/claims/{claimId}/status` | Claim status ပြောင်းရန် | Food Provider |
| `POST` | `/api/food-providers/claims/{claimId}/verify-pickup` | Pickup OTP အတည်ပြုရန် | Food Provider |
| `POST` | `/api/food-providers/claims/{claimId}/pickup-otp` | Pickup OTP အသစ်ထုတ်ရန် | Food Provider |
| `GET` | `/api/food-providers/reports/impact` | Provider impact/financial report | Food Provider |
| `GET`, `PUT` | `/api/organizations/profile` | Organization profile ကြည့်/ပြင် | Organization |
| `PUT` | `/api/organizations/capacity` | Daily capacity ပြင်ရန် | Organization |
| `POST` | `/api/admin/users/{id}/approve` | User အတည်ပြုရန် | Admin |
| `POST` | `/api/admin/users/{id}/reject` | User ပယ်ချရန် | Admin |
| `GET` | `/api/admin/users` | လက်ရှိ placeholder response | Admin |
| `POST` | `/api/admin/users/{id}/assign-role` | လက်ရှိ placeholder response | Admin |

**Volunteer API endpoint များ မရှိသေးပါ။** `Vehicle` နှင့် `DeliveryMission`
အတွက် model/DAO များသာရှိပြီး controller route များ မထုတ်ပြန်ထားပါ။

### အရေးကြီးသော status များ

- Verification: `PENDING`, `VERIFIED`, `REJECTED`
- Listing: `AVAILABLE`, `RESERVED`, `PICKED_UP`, `DELIVERED`, `EXPIRED`
- Claim: `REQUESTED`, `CONFIRMED`, `PREPARING`, `READY_FOR_PICKUP`,
  `COMPLETED`, `REJECTED`, `CANCELLED`
- Delivery mission model အတွက်: `ASSIGNED`, `IN_TRANSIT`, `DELIVERED`,
  `DISPUTED`, `CANCELLED`

### Listing နှင့် pickup မှတ်စု

- `offerType` သည် `DONATION` သို့မဟုတ် `DISCOUNTED_SALE` ဖြစ်သည်။
- Discounted sale အတွက် positive `priceAmount` လိုအပ်သည်။ Partial serving ရောင်းချမှု
  စျေးနှုန်းကို listing ၏ `servingsEquivalent` အပေါ် အချိုးကျတွက်သည်။
- `imageUrl` နှင့် `licenseDocumentUrl` သည် ပြင်ပ file/object storage တွင်
  သိမ်းထားပြီးသား resource များကို ရည်ညွှန်းသည်။ Backend တွင် multipart upload မရှိပါ။
- Sale amount များကို report အတွက် သိမ်းထားခြင်းသာဖြစ်ပြီး payment gateway နှင့်
  currency conversion မပါဝင်ပါ။
- Claim flow တွင် pickup OTP ကို အသုံးပြုသည်။ OTP ကို database တွင် hash လုပ်သိမ်းပြီး
  ကြိုးစားမှုအရေအတွက် ကန့်သတ်ထားသည်။

## အချက်အလက်မော်ဒယ် အကြမ်းဖျဉ်း

- `User` နှင့် `Role` သည် authentication, role နှင့် verification အခြေအနေကို ကိုင်တွယ်သည်။
- `FoodProvider` နှင့် `ProviderOperatingHour` သည် provider profile နှင့်
  အလုပ်ချိန်များကို ကိုင်တွယ်သည်။
- `FoodListing` နှင့် `FoodCategory` သည် ပိုလျှံအစားအစာများကို ကိုယ်စားပြုသည်။
- `Organization` နှင့် `FoodClaim` သည် claim တင်မှုနှင့် daily capacity ကို ကိုင်တွယ်သည်။
- `Volunteer`, `Vehicle`, `DeliveryMission` သည် အနာဂတ် delivery flow အတွက်
  persistence model အဖြစ် ရှိသော်လည်း workflow မပြည့်စုံသေးပါ။
- Notification, rating, food safety, audit နှင့် impact ဆိုင်ရာ entity များရှိသည်။
  Entity ရှိနေခြင်းတစ်ခုတည်းဖြင့် API/UI feature ပြီးစီးကြောင်း မဆိုလိုပါ။

## လက်ရှိကန့်သတ်ချက်များနှင့် ဆက်လက်လုပ်ရန်

1. Organization profile, signup validation, capacity reset/reservation, claim
   cancel/reject flows ကို MySQL ပါသော integration tests များဖြင့် ထပ်မံစမ်းသပ်ရန်။
2. Volunteer လိုအပ်ချက်များကို အတည်ပြုရန်: profile, location, availability,
   vehicle details, mission assignment, pickup/delivery proof, status transition,
   cancellation/dispute နှင့် notification များ။
3. Volunteer အတွက် controller/service/API authorization နှင့် lifecycle validation
   တည်ဆောက်ရန်။ Listing/claim/pickup workflow နှင့် ဘယ်အချိန်တွင် mission ဖန်တီးမည်၊
   Volunteer က ဘယ်အချိန်တွင် လက်ခံနိုင်မည်ဆိုသည့် စည်းမျဉ်းများကို မသတ်မှတ်မီ
   delivery code မရေးသင့်ပါ။
4. Volunteer registration မှ dashboard အထိ frontend flow နှင့် API tests ထည့်ရန်။
5. Admin placeholder endpoint များကို လုပ်ဆောင်ချက်အပြည့်အစုံဖြစ်စေရန် သို့မဟုတ်
   မပြီးသေးသော endpoint များအဖြစ် သေချာဖော်ပြရန်။
6. Local development အတွက် default security configuration များကို သီးခြားထားပြီး
   production secrets ကို environment/secret manager မှသာ ဖြည့်သွင်းရန်။

## Database upgrade မှတ်ချက်

ယခင် database schema တွင် `food_claims.food_listing_id` ကို unique သတ်မှတ်ထားခဲ့ပါက
လက်ရှိ claim model နှင့် မကိုက်ညီနိုင်သည်။ Backend README တွင် အဲဒီ unique index ကို
မဖျက်ခင် စစ်ဆေးပြီး ချိန်ညှိရန် SQL ဥပမာရှိသည်:
[backend README](./foodCycle-backend/README.md)။
