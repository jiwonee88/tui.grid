tui.util.defineNamespace("fedoc.content", {});
fedoc.content["view_datePickerLayer.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Layer View class which contains the 'tui-component-date-picker'\n * @author NHN Ent. FE Development Team\n */\n'use strict';\n\nvar View = require('../base/view');\nvar classNameConst = require('../common/classNameConst');\nvar DEFAULT_DATE_FORMAT = 'yyyy-mm-dd';\nvar DatePickerLayer;\n\n/**\n * Returns a HTML string of a span element to represent an arrow-icon\n * @param {String} dirClassName - className to indicate direction of the arrow\n * @returns {String}\n */\nfunction arrowHTML(dirClassName) {\n    var classNameStr = classNameConst.ICO_ARROW + ' ' + dirClassName;\n\n    return '&lt;span class=\"' + classNameStr + '\">&lt;/span>';\n}\n\n/**\n * Layer View class which contains the 'tui-component-date-picker'\n * @module view/datePickerLayer\n * @extends module:base/view\n */\nDatePickerLayer = View.extend(/**@lends module:view/datePickerLayer.prototype */{\n    /**\n     * @constructs\n     * @param {Object} options - Options\n     */\n    initialize: function(options) {\n        this.textPainter = options.textPainter;\n        this.columnModel = options.columnModel;\n        this.domState = options.domState;\n        this.calendar = this._createCalendar();\n        this.datePicker = this._createDatePicker();\n\n        this._customizeCalendarBtns();\n\n        this.listenTo(this.textPainter, 'focusIn', this._onFocusInTextInput);\n        this.listenTo(this.textPainter, 'focusOut', this._onFocusOutTextInput);\n    },\n\n    className: classNameConst.LAYER_DATE_PICKER,\n\n    /**\n     * Creates an instance of 'tui-component-calendar'\n     * @returns {tui.component.Calendar}\n     * @private\n     */\n    _createCalendar: function() {\n        var $calendarEl = $('&lt;div>').addClass(classNameConst.CALENDAR);\n\n        // prevent blur event from occuring in the input element\n        $calendarEl.mousedown(function(ev) {\n            ev.preventDefault();\n            ev.target.unselectable = true;  // trick for IE8\n            return false;\n        });\n\n        return new tui.component.Calendar({\n            element: $calendarEl,\n            classPrefix: classNameConst.CALENDAR + '-'\n        });\n    },\n\n    /**\n     * Customize the buttons of the calendar.\n     * @private\n     */\n    _customizeCalendarBtns: function() {\n        var $header = this.calendar.$header;\n        var leftArrowHTML = arrowHTML(classNameConst.ICO_ARROW_LEFT);\n        var rightArrowHTML = arrowHTML(classNameConst.ICO_ARROW_RIGHT);\n\n        $header.find('.' + classNameConst.CALENDAR_BTN_PREV_YEAR).html(leftArrowHTML + leftArrowHTML);\n        $header.find('.' + classNameConst.CALENDAR_BTN_NEXT_YEAR).html(rightArrowHTML + rightArrowHTML);\n        $header.find('.' + classNameConst.CALENDAR_BTN_PREV_MONTH).html(leftArrowHTML);\n        $header.find('.' + classNameConst.CALENDAR_BTN_NEXT_MONTH).html(rightArrowHTML);\n    },\n\n    /**\n     * Creates an instance of 'tui-component-date-picker'\n     * @returns {tui.component.DatePicker}\n     * @private\n     */\n    _createDatePicker: function() {\n        var datePicker = new tui.component.DatePicker({\n            parentElement: this.$el,\n            enableSetDateByEnterKey: false,\n            selectableClassName: classNameConst.CALENDAR_SELECTABLE,\n            selectedClassName: classNameConst.CALENDAR_SELECTED,\n            pos: {\n                top: 0,\n                left: 0\n            }\n        }, this.calendar);\n\n        datePicker.on('update', function() {\n            datePicker.close();\n        });\n\n        return datePicker;\n    },\n\n    /**\n     * Creates date object for now\n     * @returns {{year: Number, month: Number, date: Number}}\n     * @private\n     */\n    _createDateForNow: function() {\n        var now = new Date();\n\n        return {\n            year: now.getFullYear(),\n            month: now.getMonth() + 1,\n            date: now.getDate()\n        };\n    },\n\n    /**\n     * Resets date picker options\n     * @param {Object} options - datePicker options\n     * @param {jQuery} $input - target input element\n     * @private\n     */\n    _resetDatePicker: function(options, $input) {\n        var datePicker = this.datePicker;\n        var date = options.date || this._createDateForNow();\n\n        datePicker.setDateForm(options.dateForm || DEFAULT_DATE_FORMAT);\n        datePicker.setRanges(options.selectableRanges || []);\n        datePicker.setDate(date.year, date.month, date.date);\n        datePicker.setElement($input);\n    },\n\n    /**\n     * Calculates the position of the layer and returns the object that contains css properties.\n     * @param {jQuery} $input - input element\n     * @returns {Object}\n     * @private\n     */\n    _calculatePosition: function($input) {\n        var inputOffset = $input.offset();\n        var inputHeight = $input.outerHeight();\n        var wrapperOffset = this.domState.getOffset();\n\n        return {\n            top: inputOffset.top - wrapperOffset.top + inputHeight,\n            left: inputOffset.left - wrapperOffset.left\n        };\n    },\n\n    /**\n     * Event handler for 'focusIn' event of module:painter/input/text\n     * @param {jQuery} $input - target input element\n     * @param {{rowKey: String, columnName: String}} address - target cell address\n     * @private\n     */\n    _onFocusInTextInput: function($input, address) {\n        var columnName = address.columnName;\n        var component = this.columnModel.getColumnModel(columnName).component;\n        var editType = this.columnModel.getEditType(columnName);\n\n        if (editType === 'text' &amp;&amp; component &amp;&amp; component.name === 'datePicker') {\n            this.$el.css(this._calculatePosition($input)).show();\n            this._resetDatePicker(component.option || {}, $input);\n            this.datePicker.open();\n        }\n    },\n\n    /**\n     * Event handler for 'focusOut' event of module:painter/input/text\n     * @private\n     */\n    _onFocusOutTextInput: function() {\n        this.datePicker.close();\n        this.$el.hide();\n    },\n\n    /**\n     * Render\n     * @returns {Object} this object\n     */\n    render: function() {\n        this.$el.hide();\n        return this;\n    }\n});\n\nmodule.exports = DatePickerLayer;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"