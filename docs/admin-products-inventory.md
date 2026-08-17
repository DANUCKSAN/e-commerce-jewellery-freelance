# Product and inventory administration

The administration area lives at `/admin`. It is a server-mediated Appwrite workflow for a single Aurelle vendor; privileged API keys never enter the browser.

## One-time Appwrite setup

1. Run `npm run catalogue:provision` with a temporary `APPWRITE_API_KEY`. The key needs read/write scopes for teams, databases, tables, columns, indexes, rows, buckets, and files. Revoke it after provisioning.
2. In Appwrite Console, open **Auth → Teams → Aurella store administrators** (`store-admins`). Add the account that should administer the store.
3. Give that membership one or more roles:
   - `owner` — catalogue, publishing, media, inventory, and activity access.
   - `catalogue-manager` — catalogue, publishing, and media access.
   - `inventory-manager` — inventory adjustment access.
4. Create a separate runtime API key with only `teams.read`, `rows.read`, `rows.write`, `files.read`, and `files.write` scopes. Set it as `APPWRITE_ADMIN_API_KEY` in the server environment.
5. Keep both API keys server-only. Never prefix them with `NEXT_PUBLIC_`, commit them, log them, or send them to the browser.
6. Add the deployed hostname as an Appwrite Web platform, deploy, sign in with the team member account, and open `/admin`.

The administration screen deliberately shows a finite setup message when the runtime key is missing. A signed-in non-member receives `403`; an expired or absent session receives `401`.

## Security model

The browser requests a short-lived Appwrite JWT from its existing account session and sends it to same-origin `/api/admin/*` routes. Each request verifies the Appwrite account and confirmed `store-admins` membership. Mutation routes then enforce the required team role and reject cross-origin browser requests.

After identity and role verification, the server uses the narrowly scoped runtime key for the exact row/file mutation. Input and Appwrite responses are validated. Raw upstream errors and secrets are not returned to the browser.

Appwrite table and bucket permissions remain a second layer of protection. Public read permission exists only on a published product and its related variant, media, attributes, and files.

## Workflows

### Products

- Create a complete product as a draft with one default sellable variant.
- Edit identity, copy, category, type, material, metals, diamond flag, specifications, SEO, price, fulfilment, inventory mode, and structured attributes.
- Stock cannot be edited in the product form.
- Publish only when an active variant and at least one product image exist.
- Unpublish back to draft or archive. Archive is reversible; there is no permanent product deletion route.
- Product and variant versions prevent a stale browser from overwriting newer catalogue, price, or inventory changes.

### Media

- Accept JPEG, PNG, or WebP images up to 10 MB.
- Require useful alternative text.
- A new upload becomes primary only after the file exists; failed database writes clean up the uploaded file.
- A published product cannot lose its last image.
- File and media-row public permissions follow product publication state.

### Inventory

- Record signed, non-zero adjustments for restock, manual adjustment, damage, return, or correction.
- Reject adjustments that would make stock negative or target a made-to-order variant.
- Apply variant stock, derived availability, ledger movement, and audit entry in one Appwrite transaction.
- Use a unique UUID operation ID for idempotency.
- Detect stale variant versions so simultaneous stock editors cannot silently overwrite each other.

### Activity

Product creation/editing/status, media, and stock actions create append-only audit entries. The UI exposes the latest entries without exposing full before/after snapshots.

## Operational checklist

- Rotate the runtime key periodically and after suspected exposure.
- Restrict deployment environment access to trusted operators.
- Add rate limiting at the deployment edge for `/api/admin/*` before public launch.
- Back up Appwrite data and test restore procedures.
- Monitor `401`, `403`, `409`, `422`, and `5xx` responses and Appwrite transaction failures.
- Test publishing, unpublishing, image upload, concurrent edits, negative stock rejection, and key rotation in staging before production deployment.
