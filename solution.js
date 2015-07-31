var Tree = function(name) {
  this.name = name;
  this.children = [];

  var parent = null;

  this.getParent = function() {
    return parent;
  };
  this.setParent = function(tree) {
    parent = tree;
  };
  this.addChild = function(tree) {
    tree.setParent(this);
    this.children.push(tree);
  };
};

var StringToTreeParser = function() {
  var index = 0;

  function parseAction(char) {
    return char.match('\{|,|\}');
  }

  function shouldContinue(char) {
    return RegExp('\{|,|\}').test(char);
  }

  function parseToTree(rawString) {
    index = 0;
    var buffer = '';
    while (index < rawString.length) {
      if (!shouldContinue(rawString[index])) {
        buffer += rawString[index];
        index++;
        continue;
      }
      index++;
      treeNode = new Tree(buffer);
      buildTree(rawString, treeNode, index);
      buffer = '';
      index++;
    }
    return treeNode;
  }

  function buildTree(rawString, tree) {
    var buffer = '';
    while (index < rawString.length) {
      if (tree == null)
        return;
      var matchArr = parseAction(rawString[index]);
      matchArr = matchArr == null ? matchArr : matchArr[0];
      switch (matchArr) {
        case '{': //add child condition and recurse down
          {
            index++;
            var treeNode = new Tree(buffer);
            buffer = '';
            tree.addChild(treeNode);
            return buildTree(rawString, treeNode);
          }
          break;
        case ',': //parse and add child
          {
            index++;
            if (buffer.length === 0) continue;
            var treeNode = new Tree(buffer);
            buffer = '';
            tree.addChild(treeNode);
          }
          break;
        case '}': // go back up to the parent
          {
            index++;
            if (buffer.length > 0) {
              var treeNode = new Tree(buffer);
              tree.addChild(treeNode);
            }
            buffer = '';
            return buildTree(rawString, tree.getParent());
          }
          break;

        default: //continue adding to buffer
          buffer += rawString[index];
          index++;
          continue;
      }
    }

    return;
  }

  var outputStr = '';

  function stringify(tree) {
    preorder(tree);
    return outputStr;
  }

  function preorder(tree) {
    outputStr += tree.name;
    if (tree.children.length === 0) {
      return;
    } else {
      outputStr += '{';
    }
    for (var i = 0; i < tree.children.length; i++) {
      preorder(tree.children[i]);
      if (i + 1 < tree.children.length) {
        outputStr += ',';
      } else {
        outputStr += '}';
      }
    }
  }

  return {
    parseToTree: parseToTree,
    stringify: stringify
  };
};

var parser = new StringToTreeParser();
var rawString = "buildings{house{kitchen{oven,fridge{meat,cheese,beer,soda,vegetables,ice},stove,table},garage{cars{brake,gas},bikes{pedal,handlebars}},bathroom{sink,tub}},office{meetingroom{telephone,projector},kitchen{coffeemaker{coffee,water},watercooler{water}},parkinggarage{cars{brake,gas},bikes{pedal,handlebars}}}}";
var tree = parser.parseToTree(rawString);
console.dir(JSON.stringify(tree));
var stringified = parser.stringify(tree);
console.log(['\nORIGINAL:', rawString, '\nSTRINGIFIED:', stringified].join(' '));
console.log('\nMATCH: ', rawString === stringified);
