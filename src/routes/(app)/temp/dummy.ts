export const simple = `
TABLE member {
  id uuid
  name varchar(200)
}
`;

export const withAlias = `
TABLE member as m {
  id uuid
  name varchar(200)
}
`;

export const withGroup = `
TABLEGROUP member_group {
  member
  permission
}

TABLE member {
  id uuid
  name varchar(200)
}

TABLE permission {
  id uuid
  name varchar(200)
}
`;

export const withSchema = `
TABLEGROUP member.member_group {
  member.member
  member.permission
}

TABLE member.member {
  id uuid
  name varchar(200)
}

TABLE member.permission {
  id uuid
  name varchar(200)
}
`;

export const withProject = `
Project project_name {
  database_type: 'PostgreSQL'
  Note: 'Description of the project'
}

TABLEGROUP member.member_group {
  member.member
  member.permission
}

TABLE member.member as m {
  id uuid
  name varchar(200)
}

TABLE member.permission {
  id uuid
  name varchar(200)
}
`;

export const withRef = `
TABLE member as m {
  id uuid
  name varchar(200)
}

TABLE permission {
  id uuid [ref: > member_permission.permission_id, ref: > item.permission_id]
  name varchar
}

TABLE member_permission {
  id uuid
  member_id uuid [ref: - m.id]
  permission_id uuid
}

TABLE item {
  id uuid
  permission_id uuid
  permission_name varchar
}

Ref: item.(permission_id, permission_name) > permission.(id, name)
`;

export const withIndexes = `
Project project_name {
    database_type: 'PostgreSQL'
    Note: 'Description of the project'
  }

TABLEGROUP member.member_group {
  member.member
  member.permission
  member.member_permission
}

TABLE member.member as m {
  id uuid
  name varchar(200)
    Indexes {
    name [name: "member_name"]
    (id, name) [name: "mail_history_subject"]
  }
}

TABLE member.permission {
  id uuid
  name varchar(200)
}

TABLE member.member_permission {
  id uuid
  member_id uuid [ref: - m.id]
  permission_id uuid [ref: < member.permission.id]
}
`;

export const withConstraint = `
Table users {
  id integer [primary key, not null, unique, default: 123, increment, note: 'this is note']
  username varchar
  role varchar
  created_at timestamp
}
`;

export const cozyimg = `
TABLE bucket {
  id UUID [pk]
  owner UUID
  name varchar
  path varchar
  created_at datetime
  updated_at datetime
}

TABLE apikey {
  id UUID [pk]
  name varchar
  bueckt_id UUID [ref: - bucket.id]
  owner UUID
  created_at datetime
}

TABLE size_preset_setting {
  id UUID [pk]
  bueckt_id UUID [ref: > bucket.id]
  name varchar
  value varchar // w320h160 << 이런식
}
`;

export const kirinuki = `
Table youtube_channel {
  id varchar(24) [pk, not null]
  created_at datetime [not null]
  updated_at datetime [not null]
  playlist_id varchar(24) [not null]
  name varchar(50) [not null]
  display_name varchar(50) [not null]
  thumbnail varchar(2000) [not null]
}


Ref: youtube_channel.id < kirinukist.youtube_channel_id

Ref: youtube_channel.id < vtuber.youtube_channel_id

Table kirinukist {
  uuid varchar(255) [pk, not null]
  created_at datetime [not null]
  updated_at datetime [not null]
  youtube_channel_id varchar(24) [not null]

  Indexes {
    youtube_channel_id [name: "kirinukist_youtube_channel_id_index"]
  }
}

Ref: kirinukist.uuid < video.kirinukist_uuid

Table vtuber {
  uuid varchar(255) [pk, not null]
  created_at datetime [not null]
  updated_at datetime [not null]
  youtube_channel_id varchar(24) [not null]
  mcn_group_id int [not null]

  Indexes {
    youtube_channel_id [name: "vtuber_youtube_channel_id_index"]
  }
}

Ref: vtuber.uuid < video_vtubers.vtuber_uuid
Ref: vtuber.mcn_group_id - mcn_group.id

//

//

Table video_vtubers {
  video_id varchar(11) [not null]
  vtuber_uuid varchar(255) [not null]

  Indexes {
    (video_id, vtuber_uuid) [pk]
    video_id [name: "video_vtubers_video_id_index"]
    vtuber_uuid [name: "video_vtubers_vtuber_uuid_index"]
  }
}

//

//

Table video {
  id varchar(11) [pk, not null]
  created_at datetime [not null]
  kirinukist_uuid varchar(255) [not null]
  title varchar(100) [not null]
  thumbnail varchar(2000) [not null]

  Indexes {
    kirinukist_uuid [name: "video_kirinukist_uuid_index"]
  }
}


Ref: video.id < video_vtubers.video_id


Table mcn {
  id int [pk, increment]
  name varchar(50) [not null]
  display_name varchar(50) [not null]
}

Ref: mcn.id < mcn_group.mcn_id

Table mcn_group {
  id int [pk, increment]
  name varchar(50) [not null]
  display_name varchar(50) [not null]
  mcn_id int(11) [not null]

  Indexes {
    mcn_id [name: "mcn_group_mcn_id_index"]
  }
}
`;

export const cozy = `
// !blog

TABLEGROUP blog {
  space
  post
  post_content
  meta
  meta_content
  refresh_queue
  space_message 
}

TABLE space {
  id uuid [pk]
  uid varchar(36)
  slug varchar(20) [unique]
  database_id uuid // notion database id
  title varchar(40)
  state byte
  created_at datetime
  updated_at datetime
  last_refresed_at datetime
}

TABLE post {
  id uuid [pk] // notion page id
  space_id uuid [ref: > space.id]
  state byte
  slug varchar(200)
  title varchar(200)
  tags varchar(300)
  description varchar(400)
  created_at datetime
  updated_at datetime
}

TABLE post_content {
  id uuid [pk]
  post_id uuid [ref: - post.id]
  json jsonb
}

TABLE meta {
  id uuid [pk] // notion page id
  space_id uuid [ref: > space.id]
  title varchar(200)
  updated_at datetime
}

TABLE meta_content {
  id uuid [pk]
  meta_id uuid [ref: - meta.id]
  json jsonb
}

TABLE refresh_queue {
  id uuid [pk]
  space_id uuid [ref: > space.id]
  source_type refresh_queue_source_type
  page_id uuid
  type refresh_queue_type
  state refresh_queue_state

  updated_at datetime
  created_at datetime
}

ENUM refresh_queue_sourece_type {
  NONE
  SPACE
  META
  POST
}

ENUM refresh_queue_type {
  NONE
  META
  POST
}

ENUM refresh_queue_state {
  NONE
  TODO
  IN_PROGRESS
  DONE
  CANCELED
  TERMINATED
}

TABLE space_message {
  id UUID [pk]
  sender_uid varchar(36)
  space_id uuid [ref: > space.id]
  title varchar(1024)
  content text
  receive_address varchar(256)
  check_state space_message_check_state
  state space_message_state
}

ENUM space_message_check_state {
  NONE
  UNVIEWED
  VIEWED
}

ENUM space_message_state {
  NONE
  DELETED
}

// ~blog

// !member

TABLEGROUP member {
  member
}

TABLE member {
  uid varchar(36) [pk]
  access_token varchar(255)
  created_at datetime
  updated_at datetime
}

// ~member

Ref: "space"."state" < "space"."updated_at"
`;

export const withJoin = `
TABLE member {
  id uuid
  name varchar(200)
}

TABLE post {
  id uuid
  member_id uuid
}

Ref: member.id < post.id
`;

export const unMountUx = `
Table users {
  id integer [primary key]
  username varchar
  role varchar
  created_at timestamp
}
Table follows {
  following_user_id integer
  followed_user_id integer
  created_at timestamp 
}




Table follows1 {
  following_user_id integer
  followed_user_id integer
  created_at timestamp 
}

Table posts {
  id integer [primary key]
  title varchar
  body text [note: 'Content of the post']
  user_id integer
  status varchar
  created_at timestamp
}

Table users1 {
  id integer [primary key]
  username varchar
  role varchar
  created_at timestamp
}



Table posts1 {
  id integer [primary key]
  title varchar
  body text [note: 'Content of the post']
  user_id integer
  status varchar
  created_at timestamp
}

Table users2 {
  id integer [primary key]
  username varchar
  role varchar
  created_at timestamp
}



Table posts3 {
  id integer [primary key]
  title varchar
  body text [note: 'Content of the post']
  user_id integer
  status varchar
  created_at timestamp
}
`;
