create table tutorials
(
    id          int auto_increment
        primary key,
    title       varchar(1000) charset utf8mb3 null,
    description text                          null,
    published   tinyint                       null
);
