# CYCLE HUB — Bicycle E-commerce

Premium bicycle storefront and secure store-management dashboard for CYCLE HUB, Samastipur, Bihar.

## Stack
- React + Vite + React Router
- Supabase Postgres, Auth and Storage
- Vercel deployment

## Live application
- Store: https://cycle-hubstore3.vercel.app
- Admin: https://cycle-hubstore3.vercel.app/admin/login

## Connected services
- Supabase project: `cycle-hub` (Mumbai / ap-south-1)
- Product catalogue, inventory, order records and service requests are stored in Supabase.
- Product images use the existing public `cycle-images` bucket. Upload/delete is restricted by Storage policies to authenticated users with `app_metadata.role = admin`.
- Checkout currently accepts Cash on Delivery only. Online payment is intentionally disabled until a merchant gateway account and server-side credentials are configured.

## First administrator setup
1. In Supabase Dashboard → Authentication → Users, create the store administrator using an email and a strong password.
2. Open Supabase SQL Editor and run the following after replacing the email:
   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
     || jsonb_build_object('role', 'admin')
   where email = 'YOUR_ADMIN_EMAIL';
   ```
3. Sign in at `/admin/login`. Sign out and sign in again after changing the role so the JWT refreshes.
4. Never assign the admin role through `user_metadata`; it is user-editable and must not be used for authorization.

## Admin features
- Dashboard and live database product/order metrics
- Product create, edit, delete, stock and image upload
- Order status management
- Customer list derived from orders
- Service request management
- Inventory and reports

## Customer features
- Product catalogue, search, category/price filters and product details
- Cart and wishlist
- COD checkout with server-side price/stock validation and duplicate-submit protection
- Order confirmation and order tracking using order number + registered mobile
- Service booking requests

## Environment variables
Configured in Vercel for Production, Preview and Development:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (publishable key; never put a service-role key in the browser)

## Remaining external setup before full commercial launch
- Configure Razorpay (or another supported payment provider) merchant account, webhook secret and server-side payment verification. Do not mark an order paid based only on a browser callback.
- Configure courier account/API and serviceability, shipping rates, labels and tracking webhooks.
- Configure WhatsApp Cloud API or an approved provider for opt-in CRM campaigns. The WhatsApp Business mobile app alone does not provide unattended bulk automation.
- Set SMTP/custom email provider and test transactional delivery.
- Confirm GST, return/refund, warranty, delivery and privacy policies.
- Set up backups and review Supabase security/performance advisors regularly.

## Safety notes
- Supabase RLS protects product administration, orders and service-request administration.
- The public checkout RPC recalculates prices from the database and reserves stock in a transaction.
- Public tracking requires both the order number and matching mobile number and returns limited tracking data.
- Do not expose Supabase secret/service-role keys in Vite environment variables or client code.
