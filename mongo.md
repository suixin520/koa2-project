**MongoDB的一些基础知识**

> MongoDB的基本概念
由三个部分组成：document（文档）、collection（集合）、database（数据库）
document：即键值对组成，是一个单元，相当于关系型数据库中的表中的一行记录。
collection：由多个文档组成，有多行记录，相当于关系型数据库中的一张表。
database：由多个集合组成，相当于关系型数据库中的一个数据库。

> mongoose的基本概念
由三个部分组成：schema、model、entity
schema：数据定义，创建一张表时候的每个字段是什么类型，长度，即表字段的定义，映射到一个collection，纯定义，不存在操作数据。
model：schema发布生成的模型，具备某张表操作能力的函数集合（增删查改），也可对单条数据进行操作的核心能力。
entity：model创建的数据实体，具体来说就是某条数据集成的方法（某条数据自我修改的能力）。

> 新建数据库或者切换到某一数据库
use dataBaseName

> 查看数据库中的表
show tables

> 查看数据库表中的所有值
db.tableName.find({})