# Scanner
Scanner 类可以用来获取用户输入，需要导入 `java.util.Scanner`

## System.in
调用系统输入功能

 ```java
 import java.util.Scanner;

public class ExtractDigits {
  public static void main(String[] args) {
    System.out.print("请输入一个三位数：");
    Scanner input = new Scanner(System.in);
    int num = input.nextInt();
    int ones = num % 10;
    int tens = (num / 10) % 10;
    int hundreds = num / 100;
    System.out.println("个位是 " + ones);
    System.out.println("十位是 " + tens);
    System.out.println("百位是 " + hundreds);
    input.close();    //关闭 Scanner，可选
  }
}
 ```

**输入**

```
583
```

**输出**

```
个位是 3
十位是 8
百位是 5
```