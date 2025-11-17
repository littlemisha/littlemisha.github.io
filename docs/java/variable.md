# 变量与常量
在Java中，变量与常量在使用前需要声明

## 变量

```java
public class Age {
  public static void main(String[] args) {
    short age=15;
    System.out.println("小明今年"+age+"岁");
  }
}
```

**输出**

```
小明今年15岁
```

## 常量

```java
public class Pi {
  public static void main(String[] args) {
    final double PI=3.14;
    System.out.println("π约等于"+PI);
  }
}
```

**输出**

```
π约等于3.14
```