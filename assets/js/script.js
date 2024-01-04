$(function () {
  var saveConfirmEl = $("#saveConfirm");  // Element for the save confirmation
  var currentDay = dayjs();               // Today 

  /* === makeHour ===
  Creates a new hour block based on the hourIndex (time) passed in
  === makeHour ===*/
  function makeHour(hourIndex) {
    let calendarEl = $("#calendar");   // Main element where the time blocks will be inserted
    let hourEl = $("<div>");           // Hour block element
    let timeEl = $("<div>");           // Time element in the hour block
    let textAreaEl = $("<textarea>");  // Text entry area element
    let buttonEl = $("<button>");      // Save button element
    let iconEl = $("<i>");             // Disc icon element

    let hourID = "hour-" + hourIndex;          // text for hour block id
    let hourClass;                             // text for the hour element class (past/present/future)
    let currentHour = dayjs().hour(hourIndex); // dayjs hour based on hour index

    // determines which class to assign the hour element based on time of day
    if (hourIndex < currentDay.hour()) {
      hourClass = "past";
    } else if (hourIndex === currentDay.hour()) {
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
    timeEl.text(currentHour.format("hA"));

    // creates element hierarchy and appends to the calendar element
    hourEl.append(timeEl);
    hourEl.append(textAreaEl);
    buttonEl.append(iconEl);
    hourEl.append(buttonEl);
    calendarEl.append(hourEl);
  }

  /* === hourUpdate ===
  Updates the classes/formatting for each hour block as well as the current date in the header.
  === hourUpdate ===*/
  function hourUpdate() {
    let curDayStr = currentDay.format("dddd, MMMM Do, YYYY");
    let curDayEl = $("#currentDay");
    let hourEl;
    let hourIndex;

    // for testing purposes REMOVE
    console.log("hourUpdate has run");

    // displays the current day in the header
    curDayEl.text(curDayStr);

    // runs through each hour of the time block and updates the class based on past, present, future
    $(".time-block").each(function () {
      hourEl = $(this);
      hourIndex = parseInt(hourEl.attr("id").substr(5));

      if (hourIndex < currentDay.hour()) {
        if (!hourEl.hasClass("past")) {
          hourEl.removeClass("present");
          hourEl.removeClass("future");
          hourEl.addClass("past");
          // for testing purposes REMOVE
          console.log(
            "Hour update successfully changed " +
              hourEl.attr("id") +
              " to the past."
          );
        }
      } else if (hourIndex == currentDay.hour()) {
        if (!hourEl.hasClass("present")) {
          hourEl.removeClass("past");
          hourEl.removeClass("future");
          hourEl.addClass("present");
          // for testing purposes REMOVE
          console.log(
            "Hour update successfully changed " +
              hourEl.attr("id") +
              " to the present."
          );
        }
      } else {
        if (!hourEl.hasClass("future")) {
          hourEl.removeClass("past");
          hourEl.removeClass("present");
          hourEl.addClass("future");
          // for testing purposes REMOVE
          console.log(
            "Hour update successfully changed " +
              hourEl.attr("id") +
              " to the future."
          );
        }
      }
    });
  }

  /* === handleSave ===
  When the save button is pressed, saves text entry to localStorage and updates the button class
  === handleSave ===*/
  function handleSave(event) {
    var btnClicked = $(event.target);
    var parentID = btnClicked.parent().attr("id");         // id of the hour element
    var value = btnClicked.siblings(".description").val(); // input text
    event.preventDefault();

    // exits function if there is no parent ID or text
    if (!parentID || !value) {
      return;
    }
    // send entry to localStorage
    localStorage.setItem(parentID, value);
    // updates class for button when text has been edited
    btnClicked.removeClass("saveBtnNew");
    btnClicked.addClass("saveBtn");
    // shows the savce confirmation in the header
    saveConfirmEl.show();
  }

  /* === handleNew ===
  When the user edits one of the hour elements, updates the save button and hides the save confirmation
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
  }

  /* === getStorage ===
  Pulls all of the inputs for each hour element from localStorage
  === getStorage ===*/ 
  function getStorage() {
    let hourID;
    let value;
    let textElStr;

    for (let hourIndex = 9; hourIndex < 18; hourIndex++) {
      hourID = "hour-" + hourIndex;
      value = localStorage.getItem(hourID);
      textElStr = "#" + hourID + " .description";
      $(textElStr).val(value);
    }
  }

  // immediately hides the save confirmation text in the header
  saveConfirmEl.hide();

  // creates hour blocks from 9am to 5pm
  for (let hourIndex = 9; hourIndex < 18; hourIndex++) {
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
  var interval = setInterval(hourUpdate, 60000);
});
