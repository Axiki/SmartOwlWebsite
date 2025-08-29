import { pgTable, text, integer, timestamp, boolean, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums
export const deviceStatusEnum = pgEnum('device_status', ['active', 'inactive', 'maintenance']);
export const visitStatusEnum = pgEnum('visit_status', ['scheduled', 'in_progress', 'completed', 'cancelled']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'inactive', 'expired', 'cancelled']);
export const invoiceStatusEnum = pgEnum('invoice_status', ['pending', 'paid', 'overdue', 'cancelled']);

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Orders table
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  items: text('items').notNull(), // JSON string
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'),
  customerInfo: text('customer_info').notNull(), // JSON string
  includeInstallation: boolean('include_installation').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Contacts table
export const contacts = pgTable('contacts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Devices table
export const devices = pgTable('devices', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  name: text('name').notNull(),
  type: text('type').notNull(),
  status: deviceStatusEnum('status').default('active'),
  location: text('location'),
  installationDate: timestamp('installation_date'),
  lastMaintenance: timestamp('last_maintenance'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Memberships table
export const memberships = pgTable('memberships', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  planType: text('plan_type').notNull(),
  status: subscriptionStatusEnum('status').default('active'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  monthlyFee: decimal('monthly_fee', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Visits table
export const visits = pgTable('visits', {
  id: text('id').primaryKey(),
  deviceId: text('device_id').references(() => devices.id),
  technicianId: text('technician_id').references(() => users.id),
  scheduledDate: timestamp('scheduled_date').notNull(),
  completedDate: timestamp('completed_date'),
  status: visitStatusEnum('status').default('scheduled'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Invoices table
export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  membershipId: text('membership_id').references(() => memberships.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp('due_date').notNull(),
  paidDate: timestamp('paid_date'),
  status: invoiceStatusEnum('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertOrderSchema = createInsertSchema(orders);
export const insertContactSchema = createInsertSchema(contacts);
export const insertDeviceSchema = createInsertSchema(devices);
export const insertMembershipSchema = createInsertSchema(memberships);
export const insertVisitSchema = createInsertSchema(visits);
export const insertInvoiceSchema = createInsertSchema(invoices);

// Additional validation schemas
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

export const orderFormSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })),
  total: z.number(),
  customerInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
  }),
  includeInstallation: z.boolean().optional(),
});