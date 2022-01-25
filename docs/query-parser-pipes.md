# Query Parser Pipes

Query parser pipes parse the query string for filter, select, sort, limit and skip functionality and transform them into native TypeORM.

## Filter Parser Pipe

### Language Specification

#### Operators

| Operator   | Name              | Example                                                      |
| ---------- | ----------------- | ------------------------------------------------------------ |
| =          | Equals            | name = "john"                                                |
| !=         | Not Equals        | name != "john"                                               |
| >          | Greater           | birthdate > "1991-1-1"                                       |
| >=         | Greater or Equals | birthdate >= "1991-1-1"                                      |
| <          | Less              | birthdate < "1991-1-1"                                       |
| <=         | Less or Equals    | birthdate <= "1991-1-1"                                      |
| !          | Not               | !(birthdate > "1991-1-1")                                    |
| AND or and | And               | name = "john" and deleted = false                            |
| OR or or   | Or                | name = "john" or deleted = false                             |
| ( abd )    | Group             | (name = "john" or deleted = true) and createdAt = "2020-1-1" |

#### Literals

| Literal    | Description                        | Example                                              |
| ---------- | ---------------------------------- | ---------------------------------------------------- |
| Property   | Identifier string ends with number | name, deleted, birthdate123                          |
| String     | String literal uses quotes ' or "  | 'john', "john"                                       |
| Number     |                                    | 12345, 12345.456                                     |
| Boolean    |                                    | true, false                                          |
| Date       | Date specified by string           | 2020-1-1, 2020-01-01T00:00                           |
| Null       | Specify null value                 | NULL, null                                           |
| Range      | Range of number or date            | 10...50, "2020-1-1"..."2021-1-1"                     |
| Start With | Specify string start with string   | "john"\*, 'john'\* note that \* is outside the quote |
| End With   | Specify string ends with string    | \*"john", \*'john'                                   |
| Contains   | Specify string contains string     | \*"john"\*, \*'john'\*                               |

Query string example:

```
/users?filter=firstName = "john"* and birthdate = '1990-1-1'...'2000-1-1'
```

## Select Parser Pipe

Query string example:

```
/users?select=firstName, birthdate
```

## Sort Parser Pipe

Query string example:

```
/users?sort=-birthdate
```

## Limit Parser Pipe

Query string example:

```
/users?limit=10
```

## Skip Parser Pipe

Query string example:

```
/users?skip=10
```
