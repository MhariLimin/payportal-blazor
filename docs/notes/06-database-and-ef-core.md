# 6. Database and Entity Framework Core

## What MySQL Does

MySQL stores PayPortal data permanently.

Examples:

- Users and roles.
- Merchants.
- Contacts and addresses.
- KYC document metadata.
- Reviews.
- API credentials.
- Activity history.

Without the database, data would disappear when the application stops.

## What EF Core Does

Entity Framework Core, usually called EF Core, connects C# objects to database
tables.

```text
C# Merchant object <---- EF Core ----> Merchants table in MySQL
```

This is called an **Object-Relational Mapper**, or ORM.

Instead of manually writing SQL for every operation, much of the code uses C#
queries and entities.

## The DbContext

`PortalDbContext` is the main EF Core class.

It contains table-like properties:

```csharp
public DbSet<Merchant> Merchants => Set<Merchant>();
public DbSet<KycDocument> KycDocuments => Set<KycDocument>();
```

A `DbSet<Merchant>` represents the Merchant records in the database.

## Identity and Business Tables Share One Context

`PortalDbContext` inherits:

```csharp
IdentityDbContext<PortalUser>
```

Therefore the same MySQL database contains:

- Identity tables such as users and roles.
- PayPortal business tables such as merchants and KYC documents.

## Relationships

A Merchant has many Contacts:

```csharp
entity.HasOne(x => x.Merchant)
    .WithMany(x => x.Contacts)
    .HasForeignKey(x => x.MerchantId);
```

In simple terms:

```text
One Merchant
   |
   +-- many Contacts
   +-- many Addresses
   +-- many KYC Documents
   +-- many Reviews
   +-- many API Credentials
```

`MerchantId` is the foreign key connecting the child record to its merchant.

## Migrations

A migration is a versioned description of a database schema change.

Example flow:

```text
Change a C# entity
       |
       v
Generate an EF migration
       |
       v
Migration contains CreateTable/AlterTable operations
       |
       v
Apply migration to MySQL
```

Commands:

```powershell
dotnet ef migrations add AddSomething
dotnet ef database update
```

PayPortal applies existing migrations during startup in `DatabaseSeeder`.

## Repository Pattern

Components do not directly query `PortalDbContext`.

The Application layer defines repository contracts. Infrastructure implements
them using EF Core.

```text
Blazor page
  -> service
  -> repository
  -> PortalDbContext
  -> MySQL
```

This reduces direct coupling between UI and database code.

## Docker's Role

Docker runs MySQL in a container based on `docker-compose.yml`.

Docker is not the database technology. MySQL is the database. Docker is simply
a repeatable way to run MySQL locally.

The named Docker volume keeps database data after the container stops.

```powershell
docker compose stop mysql
```

stops MySQL but keeps the data.

```powershell
docker compose down -v
```

deletes the container and database volume.

## What Is Stored for KYC Files?

The file itself is stored under the private `uploads/kyc` directory.

MySQL stores metadata such as:

- Original document name.
- Generated storage name.
- File size.
- Content type.
- Status.
- Reviewer notes.

This keeps binary file handling separate from relational records.

## Simple Interview Explanation

> MySQL is the persistent database, while EF Core is the ORM that maps C#
> entities to tables. PortalDbContext contains both Identity and business
> records. Code First migrations version the schema, repositories isolate data
> access, and Docker provides a repeatable local MySQL environment.
