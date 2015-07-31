//we're going to make a tree so let's create a tree object
var Tree = function(name) {
  this.name = name; //name of node
  this.children = []; //children

  var parent = null; //pointer to parent
  
  //helper to get parent
  this.getParent = function() {
    return parent;
  };

  this.setParent = function(tree) {
    parent = tree;
  };
  
  //add tree to children and also set the input tree's parent to this
  this.addChild = function(tree) {
    tree.setParent(this);
    this.children.push(tree);
  };
};

//create a function that will do the parsing and stringifying
var StringToTreeParser = function() {
  
  // internal property that will hold the current index value across the tree construction
  var index = 0; 
  
  //check for an actionable character, returns null if no match found
  function parseAction(char) {
    return char.match('\{|,|\}');
  }
  
  //entry point to tree construction, this begins recursive call
  function parseToTree(rawString) {
    //reset internal index value
    index = 0;
    var buffer = ''; //clear local buffer that will store characters
    while (index < rawString.length) { //begin looping on input string
      if (parseAction(rawString[index]) == null) { //if we don't have an actionable character
        buffer += rawString[index]; //then append to buffer
        index++; // and increment index
        continue;
      }
      index++; //increment index to skip actionable character
      treeNode = new Tree(buffer); //create a new tree node with the contents of the buffer
      buildTree(rawString, treeNode, index); //begin building tree
      buffer = ''; //empty buffer
      index++; //increment index to skip actionable character
    }
    return treeNode; //return constructed tree node
  }
   //recursively called function that parses the string and constructs a tree
  function buildTree(rawString, tree) {
    var buffer = ''; //clear local buffer
    while (index < rawString.length) { //while the index isn't at the end of the string
      if (tree == null) //if we have an empty tree it means that we got here from a tree with an empty parent, so break
        return;
      var matchArr = parseAction(rawString[index]); //determine if we have an actionable item, return type is array if actionable
      matchArr = matchArr == null ? matchArr : matchArr[0]; // if array get first element, it will only ever contain 1 element if exists
      switch (matchArr) {
        case '{': //add child condition and recurse down
          {
            index++; //increment index to skip actionable character
            var treeNode = new Tree(buffer); //create new node with buffer data
            buffer = ''; //empty buffer
            tree.addChild(treeNode); //add treeNode to current nodes children
            return buildTree(rawString, treeNode); //add child condition and recurse on new node
          }
          break;
        case ',': //parse and add child
          {
            index++; //increment index to skip actionable character
            if (buffer.length === 0) continue;  //buffer could be empty in }, situation, so check for content, else continue
            var treeNode = new Tree(buffer); //create new node with buffer data
            buffer = ''; //empty buffer 
            tree.addChild(treeNode); //add treeNode to current nodes children
          }
          break;
        case '}': // go back up to the parent
          {
            index++; //increment index to skip actionable character
            if (buffer.length > 0) { //buffer could be empty in }} situation, so check for content
              var treeNode = new Tree(buffer); //create new node with buffer data
              tree.addChild(treeNode); //add treeNode to current nodes children
            }
            buffer = ''; //empty buffer
            return buildTree(rawString, tree.getParent()); // go back up to the parent
          }
          break;

        default: //continue adding to buffer
          buffer += rawString[index]; // append character to buffer
          index++; //increment index
          continue;
      }
    }

    return;
  }
  
 // internal property that will hold the constructed string value across the tree traversal
  var outputStr = '';

  //entry point to string recursive construction
  function stringify(tree) {
    preorder(tree);
    return outputStr;
  }

  //this is a tree traversal algo
  //http://www.geeksforgeeks.org/618/ <-- good tutorial on different kinds
  //preorder gives us the results we want
  //https://www.youtube.com/watch?v=S5emQOEMiqc
  function preorder(tree) {
    outputStr += tree.name; //append tree name to outputStr
    if (tree.children.length === 0) { 
      return; // if no children then we're done
    } else {
      outputStr += '{'; //else we need to append the { character
    }
    //not a binary tree so we have to loop over each child
    for (var i = 0; i < tree.children.length; i++) { 
      preorder(tree.children[i]); // recursively work on child
      if (i + 1 < tree.children.length) { //if we aren't going to have another child, add the , char to separate the children
        outputStr += ','; //append ,
      } else { // else we're done with children and have to add } char
        outputStr += '}';
      }
    }
  }
  
  //return public methods
  return {
    parseToTree: parseToTree,
    stringify: stringify
  };
};

// create new parser
var parser = new StringToTreeParser();
// get input string
var rawString = "buildings{house{kitchen{oven,fridge{meat,cheese,beer,soda,vegetables,ice},stove,table},garage{cars{brake,gas},bikes{pedal,handlebars}},bathroom{sink,tub}},office{meetingroom{telephone,projector},kitchen{coffeemaker{coffee,water},watercooler{water}},parkinggarage{cars{brake,gas},bikes{pedal,handlebars}}}}";
// create tree
var tree = parser.parseToTree(rawString);
// display tree
console.dir(JSON.stringify(tree));
// stringify tree
var stringified = parser.stringify(tree);
// log target string and constructed string
console.log(['\nORIGINAL:', rawString, '\nSTRINGIFIED:', stringified].join(' '));
// output if they match, if true, you're done
console.log('\nMATCH: ', rawString === stringified);
