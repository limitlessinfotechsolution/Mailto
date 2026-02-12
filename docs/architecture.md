# Mailto™ Architecture

## Overview
Mailto™ is a multi-tenant, enterprise-grade mail collaboration platform.

## Components
- **Browser (Blazor UI)**: iMac-inspired layout, split-pane views.
- **ASP.NET Core API**: Central API for Auth, Mail, and Calendar.
- **Mail Infrastructure**: Postfix/Exim (SMTP), Dovecot (IMAP).
- **Data Store**: PostgreSQL for relational data, Redis for caching.

## Multi-Tenancy
- Single database with tenant-scoped rows.
- Tenant resolution via domain or subdomain.
- Every query must include `TenantId`.
