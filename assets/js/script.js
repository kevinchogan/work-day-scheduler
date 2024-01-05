$(function () {
  const START_TIME = 9;                        // First hour in calendar
  const END_TIME = 17;                         // Last hour in calendar

  var saveConfirmEl = $("#saveConfirm");       // Element for the save confirmation
  var emptyStatusEl = $("#emptyStatus");       // Empty status element
  var clearButtonEl = $("#clearStorage");      // Clear storage button element

  /* === makeHour ===
  Creates a new hour block based on the hourIndex (time) passed in
  === makeHour ===*/
  function makeHour(hourIndex) {
    let calendarEl = $("#calendar");           // Main element where the time blocks will be inserted
    let hourEl = $("<div>");                   // Hour block element
    let timeEl = $("<div>");                   // Time element in the hour block
    let textAreaEl = $("<textarea>");          // Text entry area element
    let buttonEl = $("<button>");              // Save button element
    let iconEl = $("<i>");                     // Disc icon element

    let hourID = "hour-" + hourIndex;          // text for hour block id
    let hourClass;                             // hour element class (past/present/future)
    let currentHour = dayjs().hour();          // Current hour based on system clock 

    // determines which class to assign the hour element based on time of day
    if (hourIndex < currentHour) {
      hourClass = "past";
    } else if (hourIndex === currentHour) {
      hourClass = "present";
    } else {
      hourClass = "future";
    }

    // sets attributes for each element
    hourEl.attr("id", hourID);
    hourEl.attr("class", "row time-block");
    hourEl.addClass(hourClass);
    timeEl.attr("class", "col-2 col-md-1 hour text-center py-3");
    textAreaEl.attr("class", "col-8 col-md-10 description");
    textAreaEl.attr("rows", "3");
    buttonEl.attr("class", "btn saveBtn col-2 col-md-1");
    buttonEl.attr("aria-label", "save");
    iconEl.attr("class", "fas fa-save");
    iconEl.attr("aria-hidden", "true");

    // sets text for each element
    timeEl.text(dayjs().hour(hourIndex).format("hA"));

    // creates element hierarchy and appends to the calendar element
    hourEl.append(timeEl);
    hourEl.append(textAreaEl);
    buttonEl.append(iconEl);
    hourEl.append(buttonEl);
    calendarEl.append(hourEl);
  }


  /* === dayUpdate ===
  Updates the current date in the header.
  === dayUpdate ===*/
  function dayUpdate() {
    let curDayEl = $("#currentDay");
    let curDayStr = dayjs().format("dddd, MMMM Do, YYYY");

    if (curDayStr !=  curDayEl.text()) {
      curDayEl.text(curDayStr);
    }

  }

  /* === hourUpdate ===
  Updates the classes/formatting for each hour block.
  === hourUpdate ===*/
  function hourUpdate() {
    let hourEl;
    let hourIndex;
    let currentHour;

    currentHour = dayjs().hour();

    // runs through each hour of the time block and updates the class 
    // based on past, present, future
    $(".time-block").each(function () {
      hourEl = $(this);
      hourIndex = parseInt(hourEl.attr("id").substr(5));

      if (hourIndex < currentHour) {
        if (!hourEl.hasClass("past")) {
          hourEl.removeClass("present");
          hourEl.removeClass("future");
          hourEl.addClass("past");
        }
      } else if (hourIndex == currentHour) {
        if (!hourEl.hasClass("present")) {
          hourEl.removeClass("past");
          hourEl.removeClass("future");
          hourEl.addClass("present");
        }
      } else {
        if (!hourEl.hasClass("future")) {
          hourEl.removeClass("past");
          hourEl.removeClass("present");
          hourEl.addClass("future");
        }
      }
    });
  }

  /* === handleSave ===
  When the save button is pressed, saves text entry to localStorage 
  and updates the button class
  === handleSave ===*/
  function handleSave(event) {
    var btnClicked = $(event.target);
    var parentID = btnClicked.parent().attr("id");         // id of the hour element
    var value = btnClicked.siblings(".description").val(); // input text
    event.preventDefault();

    // exits function if there is no parent ID
    if (!parentID) {
      console.log("save failed - no parent");
      return;
    }
    
    // send entry to localStorage
    if (!value) {
      localStorage.removeItem(parentID);
      saveConfirmEl.text("Appointment cleared from ")
    } else {
      localStorage.setItem(parentID, value);
      saveConfirmEl.text("Appointment added to ")
    }

    // updates class for button when text has been edited
    btnClicked.removeClass("saveBtnNew");
    btnClicked.addClass("saveBtn");
    // shows the save confirmation in the header
    saveConfirmEl.show();
    emptyStatusEl.hide();
  }

  /* === handleNew ===
  When the user edits one of the hour elements, updates the save button 
  and hides the save confirmation
  === handleNew ===*/  
  function handleNew(event) {
    var entryClicked = $(event.target);
    var saveBtn = entryClicked.siblings(".saveBtn");

    // exit if no save button found
    if (!saveBtn) {
      return;
    }
    // update classes for the button
    saveBtn.removeClass("saveBtn");
    saveBtn.addClass("saveBtnNew");
    // hides the save confirmation in the header
    saveConfirmEl.hide();
    emptyStatusEl.show();
  }

  /* === getStorage ===
  Pulls all of the inputs for each hour element from localStorage
  === getStorage ===*/ 
  function getStorage() {
    let hourID;
    let value;
    let textElStr;

    for (let hourIndex = START_TIME; hourIndex <= END_TIME; hourIndex++) {
      hourID = "hour-" + hourIndex;
      value = localStorage.getItem(hourID);
      textElStr = "#" + hourID + " .description";
      $(textElStr).val(value);
    }
  }

  /* === handleClear ===
  Pulls all of the inputs for each hour element from localStorage
  === handleClear ===*/ 
  function handleClear() {
    for (let hourIndex = START_TIME; hourIndex <= END_TIME; hourIndex++) {
      hourID = "hour-" + hourIndex;
      value = localStorage.removeItem(hourID);
      textElStr = "#" + hourID + " .description";
      $(textElStr).val("");
      saveConfirmEl.text("All appointments cleared from ")
      saveConfirmEl.show();
      emptyStatusEl.hide();
    }
  }

  // immediately hides the save confirmation text in the header
  saveConfirmEl.hide();

  // creates hour blocks from from START_TIME to END_TIME inclusive
  for (let hourIndex = START_TIME; hourIndex <= END_TIME; hourIndex++) {
    makeHour(hourIndex);
  }

  // grabs the hour entries from localStorage
  getStorage();

  // listener for save buttons
  var saveBtnEl = $(".saveBtn");
  saveBtnEl.on("click", handleSave);

  // listener for text edits
  var textInputEl = $(".description");
  textInputEl.on("click", handleNew);

  // updates the past/present/future formatting every minute
  setInterval(hourUpdate, 60000);

  // updates the date in the header on load and then every 15 minutes
  dayUpdate();
  setInterval(dayUpdate, 900000);

  // clear storage button listener
  clearButtonEl.on("click", handleClear)
});
