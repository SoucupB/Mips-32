Initially, the language will have no spaces or special unrenderableCharacters.

Constant = (-2^31, 2^31);
Variable = (char)(number)(underscore).

Expression = Constant
Expression = Variable
Expression = Constant Operator Expression
Expression = Variable Operator Expression
Expression = (Expression)

Compiling the code will transform it into temporary ASM code

```
MOV $a, $b (a -> register, b -> register)
MOV [$a + constant], $b ([a] -> memory block at register + constant, b -> register)
MOV $a, [$b + constant] (a -> register, [b] -> memory block at register + constant)

push $a (pushes value of a onto the stack)
pop $a (pops value from the stack)

push *a (pushes stack with size 'a')
pop *a (pops stack of size 'a')

jmp $a (jumps at the memory value of register $a)
jmp x (jumps at absolute value x)
```


