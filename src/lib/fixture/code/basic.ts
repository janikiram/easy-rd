export const basic = `
// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs


Table orders {
  id integer [primary key]
  customer_id integer
  order_date timestamp
  status varchar [note: 'Pending, Shipped, Delivered, Cancelled']
  total_price decimal
}

Table order_items {
  id integer [primary key]
  order_id integer
  product_id integer
  quantity integer
  price decimal [note: 'Price at the time of ordering']
}

Table products {
  id integer [primary key]
  name varchar
  description text
  price decimal
  stock_quantity integer
  created_at timestamp
}

Ref: order_items.order_id > orders.id // many-to-one

Ref: order_items.product_id > products.id // many-to-one
`;
