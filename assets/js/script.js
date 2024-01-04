$(function () {
  var saveConfirmEl = $("#saveConfirm");
  var calendarEl = $("#calendar");
  var currentDay = dayjs();
  var curDayStr = currentDay.format('dddd, MMMM Do, YYYY')
  var curDayEl = $("#currentDay");


  function makeHour(hourIndex) {
    let hourEl = $("<div>");
    let timeEl = $("<div>");
    let textAreaEl = $("<textarea>");
    let buttonEl = $("<button>");
    let italicEl = $("<i>");

    let hourID = "hour-" + hourIndex;
    let hourClass;
    let currentHour = dayjs().hour(hourIndex);

    if (hourIndex < currentDay.hour()) {
      hourClass = "past"
    } else if (hourIndex === currentDay.hour()) {
      hourClass = "present"
    } else {
      hourClass = "future"
    }
    
    hourEl.attr("id", hourID);
    hourEl.attr("class", "row time-block");
    hourEl.addClass(hourClass);
    timeEl.attr("class", "col-2 col-md-1 hour text-center py-3");
    textAreaEl.attr("class", "col-8 col-md-10 description");
    textAreaEl.attr("rows", "3");
    buttonEl.attr("class", "btn saveBtn col-2 col-md-1");
    buttonEl.attr("aria-label", "save");
    italicEl.attr("class", "fas fa-save");
    italicEl.attr("aria-hidden", "true");

    timeEl.text(currentHour.format("hA"));

    hourEl.append(timeEl);
    hourEl.append(textAreaEl);
    buttonEl.append(italicEl);
    hourEl.append(buttonEl);
    calendarEl.append(hourEl);

    }


  function hourUpdate() {
    let hourEl;
    let hourIndex;

    console.log("hourUpdate has run");
    $(".time-block").each(function() {
      hourEl = $(this);
      hourIndex = parseInt(hourEl.attr("id").substr(5));

      if (hourIndex < currentDay.hour()) {
        if (!hourEl.hasClass("past")) {
          hourEl.removeClass("present");
          hourEl.removeClass("future");
          hourEl.addClass("past");
          console.log("Hour update successfully changed " + hourEl.attr("id") + " to the past.");
        }
      } else if (hourIndex == currentDay.hour()) {
        if (!hourEl.hasClass("present")) {
          hourEl.removeClass("past");
          hourEl.removeClass("future");
          hourEl.addClass("present");
          console.log("Hour update successfully changed " + hourEl.attr("id") + " to the present.");
        }
      } else {
        if (!hourEl.hasClass("future")) {
          hourEl.removeClass("past");
          hourEl.removeClass("present");
          hourEl.addClass("future");
          console.log("Hour update successfully changed " + hourEl.attr("id") + " to the future.");
        }
      }
    })
  }


  function handleSave(event) {
    var btnClicked = $(event.target);
    var parentID = btnClicked.parent().attr("id");
    var value = btnClicked.siblings(".description").val();
    event.preventDefault();

    if (!parentID || !value) {
      return;
    }
    localStorage.setItem(parentID, value)
    btnClicked.removeClass("saveBtnNew")
    btnClicked.addClass("saveBtn")
    saveConfirmEl.show();
  }


  function handleNew(event) {
    var entryClicked = $(event.target);
    var saveBtn = entryClicked.siblings(".saveBtn");

    if (!saveBtn) {
      return;
    }
    saveBtn.removeClass("saveBtn");
    saveBtn.addClass("saveBtnNew");

    saveConfirmEl.hide();
  }


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


  saveConfirmEl.hide();
  curDayEl.text(curDayStr);
  for (let hourIndex = 9; hourIndex < 18; hourIndex++) {
    makeHour(hourIndex);
  }
  getStorage();
  hourUpdate();
  var saveBtnEl = $(".saveBtn");
  saveBtnEl.on("click", handleSave);

  var textInputEl = $(".description");
  textInputEl.on("click", handleNew);

  var interval = setInterval(hourUpdate, 60000);
});