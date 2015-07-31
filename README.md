# Parser Challenge
Given any string with the following format:
```
"buildings{house{kitchen{oven,fridge},garage{car,bike},bathroom{sink,tub}},office{meetingroom{telephone,projector},kitchen{coffeemaker,watercooler},parkinggarage{cars{gears,handlebars},bikes}}}";
```

##Observations:
- What kind of structure do you see in the string?
- Is there a logical way to represent this string as a data structure?

##Challenge:
1. Write a parser that will take the parse a string with the above format and return an organized structure.
- EXTRA:  Write a function that takes your new structure and returns the original string as the result.

##Requirements:
1. Solution must be written in javascript.
- Your solution should work for any string with the above format.
- Comment your code.
- Make your code as readable as possible.
- No third party libraries allowed.
