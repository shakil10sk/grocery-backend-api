# Changelog

All notable changes to the Grocery Multi-Vendor Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-02

### Added - Phase 1

#### Authentication & Authorization
- JWT-based authentication system
- User registration with role assignment
- Email/Phone login support
- Token refresh mechanism
- Role-based access control (RBAC)
- Spatie Roles & Permissions integration
- Role middleware for route protection

#### Database Schema
- Complete database schema (16+ tables)
- Users table with multi-role support
- Addresses table with geolocation
- Categories table (hierarchical)
- Products table with vendor association
- Product variations table
- Product images table
- Shopping carts table (guest support)
- Orders table with status workflow
- Order items table
- Payments table
- Vendor profiles table
- Delivery profiles table
- Settings table (key-value)
- OTP verifications table
- App notifications table
- Payout requests table
- Spatie permissions tables

#### Models
- User model with JWT and Roles
- Address model
- Category model with relationships
- Product model with relationships
- Order model with relationships
- VendorProfile model
- DeliveryProfile model
- All models with proper fillable fields, casts, and relationships

#### API Documentation
- Swagger/OpenAPI integration
- Interactive API documentation UI
- JWT authentication in Swagger
- All endpoints documented
- Request/response schemas

#### API Endpoints
- `GET /api/health` - Health check
- `POST /api/v1/register` - User registration
- `POST /api/v1/login` - User login
- `GET /api/v1/me` - Get authenticated user
- `POST /api/v1/logout` - Logout
- `POST /api/v1/refresh` - Refresh token

#### Seeders
- RoleSeeder - Creates roles and permissions
- DatabaseSeeder - Creates demo users

#### Documentation
- Complete README.md
- Installation guide
- API documentation
- Database schema documentation
- Features documentation
- Development guide
- Documentation index

#### Configuration
- JWT configuration
- Swagger configuration
- Permissions configuration
- Environment-based configuration

### Fixed
- Added missing `deleted_at` column to users table
- Added missing user table columns (phone, avatar, language, status, fcm_token)
- Fixed model relationships
- Configured proper foreign keys and indexes

### Security
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation ready
- SQL injection protection (Eloquent)

---

## [Unreleased] - Phase 2

### Planned
- User & Profile Management API
- Category Management API
- Product Management API
- Cart System API
- Order Management API
- Payment Gateway System
- Vendor Panel Features
- Delivery Module
- Notifications System
- Settings Management
- AI Recommendations

---

## Version History

- **1.0.0** (2026-01-02) - Phase 1 Complete
  - Foundation: Authentication, Database, API Documentation
  - Ready for Phase 2 development

---

**Format:**
- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes

