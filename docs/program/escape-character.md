# 转义字符
转义字符可以用来表示表示不能直接在字符串中表示的字符

|转义字符|含义|
|:---:|:---:|
|\n|换行符|
|\t|制表符|
|\\\ |\ |

### 制表符

```java
public class Tab {
  public static void main(String[] args) {
    System.out.println("\t\t图书清单");
    System.out.println("书名\t\t\t数量\t单价\t金额");
    System.out.println("Java从入门到入土\t2\t50\t100");
    System.out.println("Java酱写真集\t\t10\t20\t200");
  }
}
```

**输出**

```
                图书清单
书名                    数量    单价    金额
Java从入门到入土        2       50      100
Java酱写真集            10      20      200
```