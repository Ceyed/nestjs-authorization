<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# NestJS Authorization (RBAC)

**Note!**

- This README is available in both [English](#table-of-contents) and [Persian](#فهرست-مطالب). <br />
- این فایل شامل توضیحات به [انگلیسی](#table-of-contents) و [فارسی](#فهرست-مطالب) موجود است

## Table of Contents

- [Setup](#setup)
- [A brief explanation](#a-brief-explanation)
- [Entities](#entities)
- [How authentication works](#how-authentication-works)
- [How authorization system works](#how-authorization-system-works)
- [How to give access or revoke access to a user](#how-to-give-access-or-revoke-access-to-a-user)
- [Modules](#modules)
- [Tools](#tools)

## Setup

To get started, simply run the following command:

```bash
docker compose up --build -d
```

Feel free to check the `.env` file if you need to make any adjustments

## A brief explanation

This app offers comprehensive user management features, allowing administrators to define roles and permissions for different user groups. Users can perform basic CRUD operations to manage users, roles, and groups (permissions). Access to specific endpoints is determined by user groups (roles and permissions), providing a secure and customizable experience.

## Entities

List of entities:

- User: Represents a user of the application. Each user has a unique id, name, username, and password. Users are associated with a Role and can belong to multiple Groups.

- Role: Defines the roles within the application. Roles have attributes such as name, luckyNumber (just for fun!), type, and priority. Each role can be associated with multiple users and groups.

- Group: Represents a group of users with similar permissions. Groups have attributes like name, scopes, permissions, and isDefault. Each group is associated with a single role and can have multiple users.

- UserGroup: Represents the relationship between users and groups. It contains the userId and groupId to establish a many-to-many relationship between users and groups.

## How authentication works

- Authentication is required for all routes except sign-in and sign-up.
- Users authenticate using a unique username and password.
- Upon successful authentication, the user receives an access token and a refresh token.
- The access token grants access to all other routes.
- Authorization is then enforced to regulate user access to specific endpoints and functionalities.

## How authorization system works

Now comes the main part. The authorization system is centered around the concept of 'Groups', combining permissions and scopes. There are five permissions available:

1. Create
2. Read
3. Update
4. Delete
5. All (combines all the above permissions)

Additionally, the application operates within six scopes:

1. Auth
2. User
3. Role
4. Group
5. Permission (a dummy module)
6. All (combines all the above scopes)

A 'Group' is formed by combining a scope with a permission. For example:

- Scope: User
- Permission: Read
- Group: (User : Read)

When such a group is assigned to a user, they gain access to the corresponding routes within the associated module (all `get` routes in `user` module).

#### Users can belong to multiple groups simultaneously

For instance, if user X is assigned to the following groups:

- User: Read
- Auth, Role: Create, Read

Then user X has `read` access to the `User` module and both `create and read` access to the `Auth and Role` modules simultaneously.

## Give access or revoke access

In this system, access control is synonymous with 'Groups'. If a user is associated with the correct group, they possess the corresponding access rights. Therefore, the only method to grant access to a user is by assigning the appropriate group to them.

By default, only administrators have the authority to create groups. To proceed, simply log in using the administrator account credentials (username: admin, password: 123). Once authenticated, you gain the capability to create the desired groups. After creating a group, you can assign it to any user as needed.

It's essential to note that both the group and the user must belong to the same role category. Groups are designed for specific roles (e.g., admin, manager, employee), and both the user and the group must share the same role designation.

Furthermore, administrators retain the ability to revoke a group from a user entirely. Consequently, users can exist without any assigned group if necessary.

## Modules

Every module (except `Auth`) has these routes:

- Create
- Read single entity
- Read all entities with `pagination` and `filters`
- Update
- Delete

**Note! We use Redis for caching our data**

### Auth

- After user signs up, hash of their password (using salt and pepper) is saved in database ([Bcrypt](https://www.npmjs.com/package/bcrypt) module)
- There is always one default role. (Now it's `Employee`). After user registered, they get default role and group. So they can access some routes from the beginning but it can change if admin change the default role to any other role with more/less groups (permissions)
- We are also use [Redis](https://redis.io/) for fast accessing user's access token and refresh token

### User

- There are three routes for updating a user profile:

1. User update their own profile
2. User update any other user's profile ONLY if they have access
3. Administrator can update any user's profile

- By default, only Administrator can delete user. need to mention that by deleting a user, their groups are also deleted

### Role

- As mentioned earlier, there are [5 static user types](#how-authorization-system-works). Roles can be created and deleted, but they must belong to ONE user type only!
- Priority: Roles have priorities:

  - Administrator: 0 (Highest)
  - Manager: 1
  - Team leader: 2
  - Employee: 3
  - Supervisor: 4

  This priority system is implemented to prioritize requests. For example, no employee can update any manager's information.

### Group

- All important notes have been mentioned before, the only thing is:

  1. You can NOT delete the default group (You have to set another group as default first).
  2. By deleting any group, you are also deleting all user-groups with the same id (You are revoking that group from all users that had it).

### Permission

My favorite module! It's just a dummy module. no functionality whatsoever. <br />
Its only purpose is to serve as an empty module for testing grouping and assigning groups.

## Tools

### Program structure

- **Framework:** NestJS
- **Database:** PostgreSQL
- **In-memory Storage:** Redis
- **ORM:** Prisma
- **Documentation:** Swagger

Additionally, various custom functions, classes and modules have been developed to enhance the overall process, which can be found in the `Libs` folder.

<p align="center">
<strong>🐼 Any contributions aimed at enhancing the system is welcome 🐼</strong>
</p>

# نام پروژه

## فهرست مطالب

- [راه اندازی](#راه-اندازی)
- [توضیح مختصر](#توضیح-مختصر)
- [موجودیت ها](#موجودیت-ها)
- [چگونگی کار احراز هویت](#چگونگی-کار-احراز-هویت)
- [چگونگی کار سیستم مجوز](#چگونگی-کار-سیستم-مجوز-سنجی)
- [چگونه به یک کاربر دسترسی داده یا دسترسی را لغو کنیم](#چگونه-به-یک-کاربر-دسترسی-داده-یا-دسترسی-را-لغو-کنیم)
- [ماژول ها](#ماژول-ها)
- [ابزار](#ابزار)

## راه اندازی

برای شروع کافیه دستور زیر رو وارد کنید:

```bash
docker compose up --build -d
```

در صورت نیاز به انجام تغییرات، می توانید فایل `.env` را بررسی کنید

## توضیح مختصر

این برنامه امکانات مدیریت جامع کاربر را فراهم می‌کند و به مدیران اجازه می‌دهد تا نقش‌ها و مجوزها را برای گروه‌های کاربری مختلف تعریف کنند. کاربران می‌توانند عملیات CRUD ابتدایی را برای مدیریت کاربران، نقش‌ها و گروه‌ها (مجوزها) انجام دهند. دسترسی به نقاط پایانی خاص (مسیر) توسط گروه‌های کاربر (نقش‌ها و مجوزها) تعیین می‌شود و تجربه‌ای امن و قابل تنظیم را ارائه می‌دهد.

## موجودیت ها

لیست موجودیت ها:

- User: کاربر سیستم. هر کاربر دارای آیدی، نام کاربری و کلمه عبور خود بوده و می تواند به یک نقش و چند گروه وصل شود

- Role: نقش کاربر در سیستم به واسطه این موجودیت تعریف می شود. تمامی نقش ها شامل نام، عدد شانس (صرفا جهت خنده!) نوع و اولویت هستند. همچنین هر نقش می تواند به هر تعداد کاربر و گروه وصل شود

- Group: هسته مجوز سنجی سیستم. نمایانگر گروه دسترسی های کاربر. هر گروه شامل فیلدهای نام، بخش ها، دسترسی ها است. هر گروه می تواند به یک نقش و چند کاربر وصل شود

- UserGroup: مدیریت نقش های وصل شده به کاربر. شامل دو فیلد آیدی کاربر و آیدی گروه که رابطه چند به چند این دو موجودیت را مدیریت می کند

## چگونگی کار احراز هویت

- احراز هویت برای همه مسیرها به جز `ورود` و `ثبت نام` الزامی است
- کاربران با استفاده از یک نام کاربری و رمز عبور منحصر به فرد احراز هویت می کنند
- پس از احراز هویت موفقیت آمیز، کاربر یک access token و یک refresh token دریافت می کند
- وجود access token دسترسی به تمام مسیرهای دیگر را ممکن می کند
- احراز هویت برای تنظیم دسترسی کاربر به مسیر های مختلف و عملکردهای خاص اعمال می شود

## چگونگی کار سیستم مجوز سنجی

مهمترین بخش سیستم. سیستم مجوز سنجی حول مفهوم "گروه ها" متمرکز است که مجوزها و ماژول ها را ترکیب می کند. پنج مجوز موجود:

1. ایجاد کردن
2. خواندن
3. ویرایش
4. حذف
5. همه (ترکیب تمام مجوزهای بالا)

علاوه بر این، برنامه در شش ماژول فعالیت می کند:

1. احراز هویت (Auth)
2. کاربر (User)
3. نقش (Permission)
4. گروه (Group)
5. مجوز (یک ماژول الکی (!) و خالی) (Permission)
6. همه (ترکیب تمام مازول های بالا)

یک "گروه" با ترکیب ماژول با مجوز تشکیل می شود. مثلا:

- ماژول: کاربر
- مجوز: خواندن
- گروه: (کاربر : خواندن)

هنگامی که چنین گروهی به یک کاربری اختصاص داده می شود، کاربر به مسیرهای مربوطه در ماژول مرتبط دسترسی پیدا می کنند (در مثال بالا، تمام مسیرهای «خواندن» در ماژول «کاربر»)

#### کاربران می توانند به طور همزمان به چندین گروه تعلق داشته باشند

به عنوان مثال، اگر کاربر X به گروه های زیر اختصاص داده شود:

- کاربر: خواندن
- احراز هویت، نقش: ایجاد، خواندن

سپس کاربر X به ماژول "User" دسترسی "خواندن" و به ماژول های "Auth و Role" به طور همزمان، دسترسی "ایجاد کردن و خواندن" را دارد

## چگونه به یک کاربر دسترسی داده یا دسترسی را لغو کنیم

در این سیستم، کنترل دسترسی مترادف با "گروه ها" است. اگر به یک کاربر گروهی اختصاص داده شود، کاربر دارای حق دسترسی مربوط به آن گروه هست. بنابراین، تنها روش اعطای دسترسی به یک کاربر، اختصاص گروه مناسب به آنها است

به‌طور پیش‌فرض، فقط مدیر حق ایجاد گروه‌ را دارد. می توانید با استفاده از مشخصات حساب مدیر (نام کاربری: admin، رمز عبور: 123) وارد شوید. پس از احراز هویت، توانایی ایجاد گروه های مورد نظر را خواهید داشت. پس از ایجاد یک گروه، می توانید آن را در صورت نیاز به هر کاربری اختصاص دهید.

لازم به ذکر است که هم گروه و هم کاربر باید به یک Role تعلق داشته باشند. گروه‌ها برای نقش‌های خاصی طراحی شده‌اند (مثلاً مدیرکل، مدیر، کارمند)، و هم کاربر و هم گروه باید نقش یکسانی داشته باشند.

علاوه بر این، مدیران این دسترسی را دارند که یک گروه (یا دسترسی) را به طور کامل از یک کاربر سلب کنند. در نتیجه، کاربران می توانند در صورت لزوم بدون هیچ گروه اختصاص داده شده وجود داشته باشند.

## ماژول ها

تمام ماژول ها (به جز «Auth») این مسیرها را دارند:

- ساخت
- خواندن یک موجودیت
- خواندن تمام موجودیت ها، دارای «صفحه بندی» و «فیلتر»
- ویرایش
- حذف

**نکته! از Redis برای ذخیره اطلاعات استفاده می شود**

### احراز هویت - Auth

- پس از ثبت نام، پسورد کاربر هش شده (با استفاده از salt و pepper) و در دیتابیس ذخیره می شود (ماژول [Bcrypt](https://www.npmjs.com/package/bcrypt)
- همیشه یک نقش پیش فرض در سیستم وجود دارد (در حال حاضر «کارمند»). پس از ثبت نام کاربر، نقش و گروه پیش فرض به او انتصاب داده می شود. بنابراین کاربر می تواند پس از ثبت نام به برخی از مسیرها دسترسی داشته باشد اما مدیرکل می تواند نقش پیش فرض را به هر نقش دیگری با گروه های بیشتر/کمتر (مجوزهای بیشتر یا کمتر) تغییر دهد.
- همچنین از [Redis](https://redis.io/) برای دسترسی سریع به access token کاربر و refresh token استفاده می شود

### کاربر - User

- سه مسیر برای به روز رسانی پروفایل کاربر وجود دارد:

1. کاربر پروفایل خود را به روز کند
2. کاربر (فقط در صورتی که دسترسی داشته باشد) اطلاعات هر کاربر دیگری را به روز کند
3. مدیر می تواند اطلاعات هر کاربر را به روز کند

- به طور پیش فرض، فقط مدیر می تواند کاربر را حذف کند. لازم به ذکر است که با حذف یک کاربر، گروه های آنها نیز حذف می شوند

### نقش - Role

- همانطور که در بالا ذکر شد، [5 نوع کاربر ثابت](#چگونگی-کار-سیستم-مجوز-سنجی) وجود دارد. نقش ها را می توان ایجاد و حذف کرد، اما آنها باید فقط به یک نوع کاربر تعلق داشته باشند!
- اولویت: نقش ها اولویت دارند: <br />
  مدیرکل: 0 (بالاترین) <br />
  مدیر: 1 <br />
  رهبر تیم: 2 <br />
  کارمند: 3 <br />
  ناظر: 4 <br />
  این روش برای داشتن محدودیت در مورد درخواست ها ایجاد شده است. بنابراین هیچ کارمندی نمی تواند اطلاعات مدیر را ویرایش کند!

### گروه - Group

- تمام نکات مهم قبلا ذکر شده است، بجز:

1. نمی توان گروه پیش فرض را حذف کرد (ابتدا باید گروه دیگری را به عنوان پیش فرض تنظیم کنیم)
2. هر گروه را که حذف می‌کنید، دسترسی‌هایش از تمام کاربرانی که آن گروه و دسترسی‌هایش را داشته‌اند، سلب می‌شود

### اجازه - Permission

تک ماژول محبوبم! فقط یک ماژول ساختگی. بدون هیچ عملکردی در سیستم <br />
تنها هدف وجود این ماژول تست گروه بندی (و بررسی دسترسی ها) توسط شماست (یک ماژول خالی فقط برای تست گروه ها و اختصاص دادن آنها)

## ابزار

### ساختار برنامه

- **Framework:** NestJS
- **Database:** PostgreSQL
- **In-memory Storage:** Redis
- **ORM:** Prisma
- **Documentation:** Swagger

همچنین بسیاری تابع، کلاس و ماژول های کمکی برای پروسه ساده تر و پیشرفته تر نوشته شده اند که می توانید تمام آنها را در پوشه `Libs` بررسی کنید

<p align="center">
<strong>🐼 از هر گونه مشارکتی که با هدف تقویت سیستم انجام شود، استقبال می شود 🐼</strong>
</p>
