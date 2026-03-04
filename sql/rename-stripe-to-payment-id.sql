-- Renomear coluna stripe_payment_id para payment_id
ALTER TABLE orders RENAME COLUMN stripe_payment_id TO payment_id;
