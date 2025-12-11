# 类型转换
将一种数据类型的值转换为另一种数据类型的过程
## 自动类型转换/隐式转换

```java
public class ImplicitConversion {
  public static void main(String[] args) {
    int num1 = 1;
    double num2 = 1.5;
    double result = num1 + num2;
    System.out.println(result);
  }
}
```

### 输出

```
2.5
```

## 强制类型转换

```java
public class ExplicitConversion {
  public static void main(String[] args) {
    double a = 2.5;
    byte b = (byte) a;
    System.out.println(b);
  }
}
```

### 输出

```
2
```