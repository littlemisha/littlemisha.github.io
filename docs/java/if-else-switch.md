# 条件语句
## if…else

```java
public class IfElse {
  public static void main(String[] args) {
    int x = 6;
    if (x >= 5) {
      System.out.println("true");
    } else {
      System.out.println("false");
    }
  }
}
```

## switch…break

```java
public class Switch {
  public static void main(String[] args) {
    int x = 1;
    switch (x + 1) {
      case 1:
        System.out.println("第一个输出");
        break;
      case 2:
        System.out.println("第二个输出");
        break;
      case 3:
        System.out.println("第三个输出");
        break;
      default:
        System.out.println("默认输出");
        break;
    }
  }
}
```

### 输出

```
第二个输出
```

### 简洁写法
在 `Java12` 及更高版本中，可以使用 `->`

```java
import java.util.Scanner;

public class SwitchJava12 {
  public static void main(String[] args) {
    System.out.print("你喜欢Java酱吗：");
    Scanner scan = new Scanner(System.in);
    String text = scan.nextLine();
    switch (text) {
      case "喜欢" -> System.out.println("Java酱：(⁠｡⁠･⁠ω⁠･⁠｡⁠)⁠ﾉ⁠♡ 好开心~");
      case "不喜欢" -> System.out.println("Java酱：(⁠ ⁠≧⁠Д⁠≦⁠) 为什么喵！！！");
      case "Ciallo～(∠・ω< )⌒☆" -> System.out.println("Java酱：Ciallo～(∠・ω< )⌒☆");
      default -> System.out.println("O⁠_⁠o");
    }
  }
}
```