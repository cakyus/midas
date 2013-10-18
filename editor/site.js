var command = "";

function InitToolbarButtons() {
  var kids = document.getElementsByTagName('DIV');

  for (var i=0; i < kids.length; i++) {
    if (kids[i].className == "imagebutton") {
      kids[i].onmouseover = tbmouseover;
      kids[i].onmouseout = tbmouseout;
      kids[i].onmousedown = tbmousedown;
      kids[i].onmouseup = tbmouseup;
      kids[i].onclick = tbclick;
    }
  }
}

function tbmousedown(e)
{
  var evt = e ? e : window.event;

  this.firstChild.style.left = 2;
  this.firstChild.style.top = 2;
  this.style.border="inset 2px";
  if (evt.returnValue) {
    evt.returnValue = false;
  } else if (evt.preventDefault) {
    evt.preventDefault( );
  } else {
    return false;
  }
}

function tbmouseup()
{
  this.firstChild.style.left = 1;
  this.firstChild.style.top = 1;
  this.style.border="outset 2px";
}

function tbmouseout()
{
  this.style.border="solid 2px #C0C0C0";
}

function tbmouseover()
{
  this.style.border="outset 2px";
}

  function insertNodeAtSelection(win, insertNode)
  {
      // get current selection
      var sel = win.getSelection();

      // get the first range of the selection
      // (there's almost always only one range)
      var range = sel.getRangeAt(0);

      // deselect everything
      sel.removeAllRanges();

      // remove content of current selection from document
      range.deleteContents();

      // get location of current selection
      var container = range.startContainer;
      var pos = range.startOffset;

      // make a new range for the new selection
      range=document.createRange();

      if (container.nodeType==3 && insertNode.nodeType==3) {

        // if we insert text in a textnode, do optimized insertion
        container.insertData(pos, insertNode.nodeValue);

        // put cursor after inserted text
        range.setEnd(container, pos+insertNode.length);
        range.setStart(container, pos+insertNode.length);

      } else {


        var afterNode;
        if (container.nodeType==3) {

          // when inserting into a textnode
          // we create 2 new textnodes
          // and put the insertNode in between

          var textNode = container;
          container = textNode.parentNode;
          var text = textNode.nodeValue;

          // text before the split
          var textBefore = text.substr(0,pos);
          // text after the split
          var textAfter = text.substr(pos);

          var beforeNode = document.createTextNode(textBefore);
          afterNode = document.createTextNode(textAfter);

          // insert the 3 new nodes before the old one
          container.insertBefore(afterNode, textNode);
          container.insertBefore(insertNode, afterNode);
          container.insertBefore(beforeNode, insertNode);

          // remove the old node
          container.removeChild(textNode);

        } else {

          // else simply insert the node
          afterNode = container.childNodes[pos];
          container.insertBefore(insertNode, afterNode);
        }

        range.setEnd(afterNode, 0);
        range.setStart(afterNode, 0);
      }

      sel.addRange(range);
  };

function getOffsetTop(elm) {

  var mOffsetTop = elm.offsetTop;
  var mOffsetParent = elm.offsetParent;

  while(mOffsetParent){
    mOffsetTop += mOffsetParent.offsetTop;
    mOffsetParent = mOffsetParent.offsetParent;
  }

  return mOffsetTop;
}

function getOffsetLeft(elm) {

  var mOffsetLeft = elm.offsetLeft;
  var mOffsetParent = elm.offsetParent;

  while(mOffsetParent){
    mOffsetLeft += mOffsetParent.offsetLeft;
    mOffsetParent = mOffsetParent.offsetParent;
  }

  return mOffsetLeft;
}

function tbclick()
{
  if ((this.id == "forecolor") || (this.id == "hilitecolor")) {
    parent.command = this.id;
    buttonElement = document.getElementById(this.id);
    document.getElementById("colorpalette").style.left = getOffsetLeft(buttonElement);
    document.getElementById("colorpalette").style.top = getOffsetTop(buttonElement) + buttonElement.offsetHeight;
    document.getElementById("colorpalette").style.visibility="visible";
  } else if (this.id == "createlink") {
    var szURL = prompt("Enter a URL:", "http://");
    if ((szURL != null) && (szURL != "")) {
      document.getElementById('edit').contentWindow.document.execCommand("CreateLink",false,szURL);
    }
  } else if (this.id == "createimage") {
    imagePath = prompt('Enter Image URL:', 'http://');
    if ((imagePath != null) && (imagePath != "")) {
      document.getElementById('edit').contentWindow.document.execCommand('InsertImage', false, imagePath);
    }
  } else if (this.id == "createtable") {
    e = document.getElementById("edit");
    rowstext = prompt("enter rows");
    colstext = prompt("enter cols");
    rows = parseInt(rowstext);
    cols = parseInt(colstext);
    if ((rows > 0) && (cols > 0)) {
      table = e.contentWindow.document.createElement("table");
      table.setAttribute("border", "1");
      table.setAttribute("cellpadding", "2");
      table.setAttribute("cellspacing", "2");
      tbody = e.contentWindow.document.createElement("tbody");
      for (var i=0; i < rows; i++) {
        tr =e.contentWindow.document.createElement("tr");
        for (var j=0; j < cols; j++) {
          td =e.contentWindow.document.createElement("td");
          br =e.contentWindow.document.createElement("br");
          td.appendChild(br);
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
      insertNodeAtSelection(e.contentWindow, table);
    }
  } else {
    document.getElementById('edit').contentWindow.document.execCommand(this.id, false, null);
  }
}

function Select(selectname)
{
  var cursel = document.getElementById(selectname).selectedIndex;
  /* First one is always a label */
  if (cursel != 0) {
    var selected = document.getElementById(selectname).options[cursel].value;
    document.getElementById('edit').contentWindow.document.execCommand(selectname, false, selected);
    document.getElementById(selectname).selectedIndex = 0;
  }
  document.getElementById("edit").contentWindow.focus();
}

function dismisscolorpalette()
{
  //document.getElementById("colorpalette").style.visibility="hidden";
}

function Start() {

  document.getElementById('edit').contentWindow.document.designMode = "on";
  try {
    document.getElementById('edit').contentWindow.document.execCommand("undo", false, null);
  }  catch (e) {
    alert("This demo is not supported on your level of Mozilla.");
  }

  InitToolbarButtons();
  if (document.addEventListener) {
    document.addEventListener("mousedown", dismisscolorpalette, true);
    document.getElementById("edit").contentWindow.document.addEventListener("mousedown", dismisscolorpalette, true);
    document.addEventListener("keypress", dismisscolorpalette, true);
    document.getElementById("edit").contentWindow.document.addEventListener("keypress", dismisscolorpalette, true);
  } else if (document.attachEvent) {
    document.attachEvent("mousedown", dismisscolorpalette, true);
    document.getElementById("edit").contentWindow.document.attachEvent("mousedown", dismisscolorpalette, true);
    document.attachEvent("keypress", dismisscolorpalette, true);
    document.getElementById("edit").contentWindow.document.attachEvent("keypress", dismisscolorpalette, true);
  }
}

// --------------------------------------------------------------------

function viewsource(source)
{
  var html;
  if (source) {
    html = document.createTextNode(document.getElementById('edit').contentWindow.document.body.innerHTML);
    document.getElementById('edit').contentWindow.document.body.innerHTML = "";
    html = document.getElementById('edit').contentWindow.document.importNode(html,false);
    document.getElementById('edit').contentWindow.document.body.appendChild(html);
    document.getElementById("toolbar1").style.visibility="hidden";
  } else {
    html = document.getElementById('edit').contentWindow.document.body.ownerDocument.createRange();
    html.selectNodeContents(document.getElementById('edit').contentWindow.document.body);
    document.getElementById('edit').contentWindow.document.body.innerHTML = html.toString();
    document.getElementById("toolbar1").style.visibility="visible";
  }
}

function usecss(source)
{
  document.getElementById('edit').contentWindow.document.execCommand("useCSS", false, !(source));
}

function readonly(source)
{
    document.getElementById('edit').contentWindow.document.execCommand("readonly", false, !(source));
}


// <!-- Midas

/**
 * Midas_Controller
 **/

function Midas_Controller() {

    this.index = function() {

    };
}

/**
 * Commands in Rich-Text Editing
 *
 * @link https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
 **/

function Midas_Commands() {

    this.backColor = function() {};
    this.bold = function() {};
    this.contentReadOnly = function() {};
    this.copy = function() {};
    this.createLink = function() {};
    this.cut = function() {};
    this.decreaseFontSize = function() {};
    this.delete = function() {};
    this.enableInlineTableEditing = function() {};
    this.enableObjectResizing = function() {};
    this.fontName = function() {};
    this.fontSize = function() {};
    this.foreColor = function() {};
    this.formatBlock = function() {};
    this.forwardDelete = function() {};
    this.heading = function() {};
    this.hiliteColor = function() {};
    this.increaseFontSize = function() {};
    this.indent = function() {};
    this.insertBrOnReturn = function() {};
    this.insertHorizontalRule = function() {};
    this.insertHTML = function() {};
    this.insertImage = function() {};
    this.insertOrderedList = function() {};
    this.insertParagraph = function() {};
    this.insertText = function() {};
    this.insertUnorderedList = function() {};
    this.italic = function() {};
    this.justifyCenter = function() {};
    this.justifyFull = function() {};
    this.justifyLeft = function() {};
    this.justifyRight = function() {};
    this.outdent = function() {};
    this.paste = function() {};
    this.redo = function() {};
    this.removeFormat = function() {};
    this.selectAll = function() {};
    this.strikeThrough = function() {};
    this.styleWithCSS = function() {};
    this.subscript = function() {};
    this.superscript = function() {};
    this.underline = function() {};
    this.undo = function() {};
    this.unlink = function() {};
    this.useCSS = function() {};
}


// Midas -->

// <!-- Main

(function() {
    window.addEventListener('load', function() {
        Start();
        var oController = new Midas_Controller;
        oController.index();
    });
})();

// Main -->
