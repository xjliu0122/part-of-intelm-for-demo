/**
 * Bundle of @devexpress/dx-react-grid
 * Generated: 2018-06-22
 * Version: 1.4.0
 * License: https://js.devexpress.com/Licensing
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('prop-types'), require('@devexpress/dx-react-core'), require('@devexpress/dx-grid-core'), require('@devexpress/dx-core'), require('react-dom')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'prop-types', '@devexpress/dx-react-core', '@devexpress/dx-grid-core', '@devexpress/dx-core', 'react-dom'], factory) :
	(factory((global.DevExpress = global.DevExpress || {}, global.DevExpress.DXReactGrid = {}),global.React,global.PropTypes,global.DevExpress.DXReactCore,global.DevExpress.DXGridCore,global.DevExpress.DXCore,global.ReactDOM));
}(this, (function (exports,React,PropTypes,dxReactCore,dxGridCore,dxCore,reactDom) { 'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var GridCore = function (_React$PureComponent) {
  inherits(GridCore, _React$PureComponent);

  function GridCore() {
    classCallCheck(this, GridCore);
    return possibleConstructorReturn(this, (GridCore.__proto__ || Object.getPrototypeOf(GridCore)).apply(this, arguments));
  }

  createClass(GridCore, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          rows = _props.rows,
          columns = _props.columns,
          getRowId = _props.getRowId,
          getCellValue = _props.getCellValue,
          Root = _props.rootComponent;


      return React.createElement(
        dxReactCore.Plugin,
        null,
        React.createElement(dxReactCore.Getter, { name: 'rows', value: rows }),
        React.createElement(dxReactCore.Getter, { name: 'getRowId', value: dxGridCore.rowIdGetter(getRowId, rows) }),
        React.createElement(dxReactCore.Getter, { name: 'columns', value: columns }),
        React.createElement(dxReactCore.Getter, { name: 'getCellValue', value: dxGridCore.cellValueGetter(getCellValue, columns) }),
        React.createElement(
          dxReactCore.Template,
          { name: 'root' },
          React.createElement(
            Root,
            null,
            React.createElement(dxReactCore.TemplatePlaceholder, { name: 'header' }),
            React.createElement(dxReactCore.TemplatePlaceholder, { name: 'body' }),
            React.createElement(dxReactCore.TemplatePlaceholder, { name: 'footer' })
          )
        )
      );
    }
  }]);
  return GridCore;
}(React.PureComponent);

GridCore.propTypes = {
  rows: PropTypes.array.isRequired,
  getRowId: PropTypes.func,
  getCellValue: PropTypes.func,
  columns: PropTypes.array.isRequired,
  rootComponent: PropTypes.func.isRequired
};

GridCore.defaultProps = {
  getRowId: undefined,
  getCellValue: undefined
};

var Grid = function Grid(_ref) {
  var rows = _ref.rows,
      columns = _ref.columns,
      getRowId = _ref.getRowId,
      getCellValue = _ref.getCellValue,
      rootComponent = _ref.rootComponent,
      children = _ref.children;
  return React.createElement(
    dxReactCore.PluginHost,
    null,
    React.createElement(GridCore, {
      rows: rows,
      columns: columns,
      getRowId: getRowId,
      getCellValue: getCellValue,
      rootComponent: rootComponent
    }),
    children
  );
};

Grid.propTypes = {
  rows: PropTypes.array.isRequired,
  getRowId: PropTypes.func,
  getCellValue: PropTypes.func,
  columns: PropTypes.array.isRequired,
  rootComponent: PropTypes.func.isRequired,
  children: PropTypes.node
};

Grid.defaultProps = {
  getRowId: undefined,
  getCellValue: undefined,
  children: undefined
};

var pluginDependencies = [{ name: 'TableColumnVisibility' }, { name: 'Toolbar' }];
var ColumnChooser = function (_React$PureComponent) {
  inherits(ColumnChooser, _React$PureComponent);

  function ColumnChooser(props) {
    classCallCheck(this, ColumnChooser);

    var _this = possibleConstructorReturn(this, (ColumnChooser.__proto__ || Object.getPrototypeOf(ColumnChooser)).call(this, props));

    _this.state = {
      visible: false
    };

    _this.handleToggle = _this.handleToggle.bind(_this);
    _this.handleHide = _this.handleHide.bind(_this);
    _this.buttonRef = _this.buttonRef.bind(_this);
    return _this;
  }

  createClass(ColumnChooser, [{
    key: 'buttonRef',
    value: function buttonRef(button) {
      this.button = button;
    }
  }, {
    key: 'handleToggle',
    value: function handleToggle() {
      this.setState({ visible: !this.state.visible });
    }
  }, {
    key: 'handleHide',
    value: function handleHide() {
      this.setState({ visible: false });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          Overlay = _props.overlayComponent,
          Container = _props.containerComponent,
          Item = _props.itemComponent,
          ToggleButton = _props.toggleButtonComponent,
          messages = _props.messages;

      var getMessage = dxGridCore.getMessagesFormatter(messages);
      var visible = this.state.visible;


      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'ColumnChooser',
          dependencies: pluginDependencies
        },
        React.createElement(
          dxReactCore.Template,
          { name: 'toolbarContent' },
          React.createElement(dxReactCore.TemplatePlaceholder, null),
          React.createElement(
            dxReactCore.TemplateConnector,
            null,
            function (_ref, _ref2) {
              var columns = _ref.columns,
                  hiddenColumnNames = _ref.hiddenColumnNames,
                  isColumnTogglingEnabled = _ref.isColumnTogglingEnabled;
              var toggleColumnVisibility = _ref2.toggleColumnVisibility;
              return React.createElement(
                React.Fragment,
                null,
                React.createElement(ToggleButton, {
                  buttonRef: _this2.buttonRef,
                  onToggle: _this2.handleToggle,
                  getMessage: getMessage,
                  active: visible
                }),
                React.createElement(
                  Overlay,
                  {
                    visible: visible,
                    target: _this2.button,
                    onHide: _this2.handleHide
                  },
                  React.createElement(
                    Container,
                    null,
                    dxGridCore.columnChooserItems(columns, hiddenColumnNames).map(function (item) {
                      var columnName = item.column.name;

                      var togglingEnabled = isColumnTogglingEnabled(columnName);
                      return React.createElement(Item, {
                        key: columnName,
                        item: item,
                        disabled: !togglingEnabled,
                        onToggle: function onToggle() {
                          return toggleColumnVisibility(columnName);
                        }
                      });
                    })
                  )
                )
              );
            }
          )
        )
      );
    }
  }]);
  return ColumnChooser;
}(React.PureComponent);

ColumnChooser.propTypes = {
  overlayComponent: PropTypes.func.isRequired,
  containerComponent: PropTypes.func.isRequired,
  itemComponent: PropTypes.func.isRequired,
  toggleButtonComponent: PropTypes.func.isRequired,
  messages: PropTypes.object
};

ColumnChooser.defaultProps = {
  messages: {}
};

var columnExtensionValueGetter = function columnExtensionValueGetter(columnExtensions, defaultValue) {
  return dxGridCore.getColumnExtensionValueGetter(columnExtensions, 'filteringEnabled', defaultValue);
};
var filterExpressionComputed = function filterExpressionComputed(_ref) {
  var filters = _ref.filters,
      filterExpressionValue = _ref.filterExpression;
  return dxGridCore.filterExpression(filters, filterExpressionValue);
};

var FilteringState = function (_React$PureComponent) {
  inherits(FilteringState, _React$PureComponent);

  function FilteringState(props) {
    classCallCheck(this, FilteringState);

    var _this = possibleConstructorReturn(this, (FilteringState.__proto__ || Object.getPrototypeOf(FilteringState)).call(this, props));

    _this.state = {
      filters: props.filters || props.defaultFilters
    };
    var stateHelper = dxReactCore.createStateHelper(_this, {
      filters: function filters() {
        return _this.props.onFiltersChange;
      }
    });

    _this.changeColumnFilter = stateHelper.applyFieldReducer.bind(stateHelper, 'filters', dxGridCore.changeColumnFilter);
    return _this;
  }

  createClass(FilteringState, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var filters = nextProps.filters;

      this.setState(_extends({}, filters !== undefined ? { filters: filters } : null));
    }
  }, {
    key: 'render',
    value: function render() {
      var filters = this.state.filters;
      var _props = this.props,
          columnExtensions = _props.columnExtensions,
          columnFilteringEnabled = _props.columnFilteringEnabled;


      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'FilteringState'
        },
        React.createElement(dxReactCore.Getter, { name: 'filters', value: filters }),
        React.createElement(dxReactCore.Getter, { name: 'filterExpression', computed: filterExpressionComputed }),
        React.createElement(dxReactCore.Getter, {
          name: 'isColumnFilteringEnabled',
          value: columnExtensionValueGetter(columnExtensions, columnFilteringEnabled)
        }),
        React.createElement(dxReactCore.Action, { name: 'changeColumnFilter', action: this.changeColumnFilter })
      );
    }
  }]);
  return FilteringState;
}(React.PureComponent);

FilteringState.propTypes = {
  filters: PropTypes.array,
  defaultFilters: PropTypes.array,
  onFiltersChange: PropTypes.func,
  columnExtensions: PropTypes.array,
  columnFilteringEnabled: PropTypes.bool
};

FilteringState.defaultProps = {
  filters: undefined,
  defaultFilters: [],
  onFiltersChange: undefined,
  columnExtensions: undefined,
  columnFilteringEnabled: true
};

var pluginDependencies$1 = [{ name: 'FilteringState', optional: true }, { name: 'SearchState', optional: true }];

var getCollapsedRowsComputed = function getCollapsedRowsComputed(_ref) {
  var rows = _ref.rows;
  return dxGridCore.filteredCollapsedRowsGetter(rows);
};
var unwrappedRowsComputed = function unwrappedRowsComputed(_ref2) {
  var rows = _ref2.rows;
  return dxGridCore.unwrappedFilteredRows(rows);
};

var IntegratedFiltering = function (_React$PureComponent) {
  inherits(IntegratedFiltering, _React$PureComponent);

  function IntegratedFiltering() {
    classCallCheck(this, IntegratedFiltering);
    return possibleConstructorReturn(this, (IntegratedFiltering.__proto__ || Object.getPrototypeOf(IntegratedFiltering)).apply(this, arguments));
  }

  createClass(IntegratedFiltering, [{
    key: 'render',
    value: function render() {
      var columnExtensions = this.props.columnExtensions;

      var getColumnPredicate = function getColumnPredicate(columnName) {
        return dxGridCore.getColumnExtension(columnExtensions, columnName).predicate;
      };

      var rowsComputed = function rowsComputed(_ref3) {
        var rows = _ref3.rows,
            filterExpression$$1 = _ref3.filterExpression,
            getCellValue = _ref3.getCellValue,
            getRowLevelKey = _ref3.getRowLevelKey,
            getCollapsedRows = _ref3.getCollapsedRows;
        return dxGridCore.filteredRows(rows, filterExpression$$1, getCellValue, getColumnPredicate, getRowLevelKey, getCollapsedRows);
      };

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'IntegratedFiltering',
          dependencies: pluginDependencies$1
        },
        React.createElement(dxReactCore.Getter, { name: 'rows', computed: rowsComputed }),
        React.createElement(dxReactCore.Getter, { name: 'getCollapsedRows', computed: getCollapsedRowsComputed }),
        React.createElement(dxReactCore.Getter, { name: 'rows', computed: unwrappedRowsComputed })
      );
    }
  }]);
  return IntegratedFiltering;
}(React.PureComponent);

IntegratedFiltering.defaultPredicate = dxGridCore.defaultFilterPredicate;

IntegratedFiltering.propTypes = {
  columnExtensions: PropTypes.array
};

IntegratedFiltering.defaultProps = {
  columnExtensions: undefined
};

var columnExtensionValueGetter$1 = function columnExtensionValueGetter(columnExtensions, defaultValue) {
  return dxGridCore.getColumnExtensionValueGetter(columnExtensions, 'editingEnabled', defaultValue);
};

var EditingState = function (_React$PureComponent) {
  inherits(EditingState, _React$PureComponent);

  function EditingState(props) {
    classCallCheck(this, EditingState);

    var _this = possibleConstructorReturn(this, (EditingState.__proto__ || Object.getPrototypeOf(EditingState)).call(this, props));

    _this.state = {
      editingRowIds: props.editingRowIds || props.defaultEditingRowIds,
      addedRows: props.addedRows || props.defaultAddedRows,
      rowChanges: props.rowChanges || props.defaultRowChanges,
      deletedRowIds: props.deletedRowIds || props.defaultDeletedRowIds
    };

    var stateHelper = dxReactCore.createStateHelper(_this, {
      editingRowIds: function editingRowIds() {
        return _this.props.onEditingRowIdsChange;
      },
      addedRows: function addedRows() {
        return _this.props.onAddedRowsChange;
      },
      rowChanges: function rowChanges() {
        return _this.props.onRowChangesChange;
      },
      deletedRowIds: function deletedRowIds() {
        return _this.props.onDeletedRowIdsChange;
      }
    });

    _this.startEditRows = stateHelper.applyFieldReducer.bind(stateHelper, 'editingRowIds', dxGridCore.startEditRows);
    _this.stopEditRows = stateHelper.applyFieldReducer.bind(stateHelper, 'editingRowIds', dxGridCore.stopEditRows);

    _this.changeRow = stateHelper.applyFieldReducer.bind(stateHelper, 'rowChanges', dxGridCore.changeRow);
    _this.cancelChangedRows = stateHelper.applyFieldReducer.bind(stateHelper, 'rowChanges', dxGridCore.cancelChanges);
    _this.commitChangedRows = function (_ref) {
      var rowIds = _ref.rowIds;

      _this.props.onCommitChanges({
        changed: dxGridCore.changedRowsByIds(_this.state.rowChanges, rowIds)
      });
      _this.cancelChangedRows({ rowIds: rowIds });
    };

    _this.addRow = stateHelper.applyFieldReducer.bind(stateHelper, 'addedRows', dxGridCore.addRow);
    _this.changeAddedRow = stateHelper.applyFieldReducer.bind(stateHelper, 'addedRows', dxGridCore.changeAddedRow);
    _this.cancelAddedRows = stateHelper.applyFieldReducer.bind(stateHelper, 'addedRows', dxGridCore.cancelAddedRows);
    _this.commitAddedRows = function (_ref2) {
      var rowIds = _ref2.rowIds;

      _this.props.onCommitChanges({
        added: dxGridCore.addedRowsByIds(_this.state.addedRows, rowIds)
      });
      _this.cancelAddedRows({ rowIds: rowIds });
    };

    _this.deleteRows = stateHelper.applyFieldReducer.bind(stateHelper, 'deletedRowIds', dxGridCore.deleteRows);
    _this.cancelDeletedRows = stateHelper.applyFieldReducer.bind(stateHelper, 'deletedRowIds', dxGridCore.cancelDeletedRows);
    _this.commitDeletedRows = function (_ref3) {
      var rowIds = _ref3.rowIds;

      _this.props.onCommitChanges({ deleted: rowIds });
      _this.cancelDeletedRows({ rowIds: rowIds });
    };
    return _this;
  }

  createClass(EditingState, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var editingRowIds = nextProps.editingRowIds,
          rowChanges = nextProps.rowChanges,
          addedRows = nextProps.addedRows,
          deletedRowIds = nextProps.deletedRowIds;

      this.setState(_extends({}, editingRowIds !== undefined ? { editingRowIds: editingRowIds } : null, rowChanges !== undefined ? { rowChanges: rowChanges } : null, addedRows !== undefined ? { addedRows: addedRows } : null, deletedRowIds !== undefined ? { deletedRowIds: deletedRowIds } : null));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          createRowChange = _props.createRowChange,
          columnExtensions = _props.columnExtensions,
          columnEditingEnabled = _props.columnEditingEnabled;
      var _state = this.state,
          editingRowIds = _state.editingRowIds,
          rowChanges = _state.rowChanges,
          addedRows = _state.addedRows,
          deletedRowIds = _state.deletedRowIds;


      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'EditingState'
        },
        React.createElement(dxReactCore.Getter, {
          name: 'createRowChange',
          value: dxGridCore.createRowChangeGetter(createRowChange, columnExtensions)
        }),
        React.createElement(dxReactCore.Getter, { name: 'editingRowIds', value: editingRowIds }),
        React.createElement(dxReactCore.Action, { name: 'startEditRows', action: this.startEditRows }),
        React.createElement(dxReactCore.Action, { name: 'stopEditRows', action: this.stopEditRows }),
        React.createElement(dxReactCore.Getter, { name: 'rowChanges', value: rowChanges }),
        React.createElement(dxReactCore.Action, { name: 'changeRow', action: this.changeRow }),
        React.createElement(dxReactCore.Action, { name: 'cancelChangedRows', action: this.cancelChangedRows }),
        React.createElement(dxReactCore.Action, { name: 'commitChangedRows', action: this.commitChangedRows }),
        React.createElement(dxReactCore.Getter, { name: 'addedRows', value: addedRows }),
        React.createElement(dxReactCore.Action, { name: 'addRow', action: this.addRow }),
        React.createElement(dxReactCore.Action, { name: 'changeAddedRow', action: this.changeAddedRow }),
        React.createElement(dxReactCore.Action, { name: 'cancelAddedRows', action: this.cancelAddedRows }),
        React.createElement(dxReactCore.Action, { name: 'commitAddedRows', action: this.commitAddedRows }),
        React.createElement(dxReactCore.Getter, { name: 'deletedRowIds', value: deletedRowIds }),
        React.createElement(dxReactCore.Action, { name: 'deleteRows', action: this.deleteRows }),
        React.createElement(dxReactCore.Action, { name: 'cancelDeletedRows', action: this.cancelDeletedRows }),
        React.createElement(dxReactCore.Action, { name: 'commitDeletedRows', action: this.commitDeletedRows }),
        React.createElement(dxReactCore.Getter, {
          name: 'isColumnEditingEnabled',
          value: columnExtensionValueGetter$1(columnExtensions, columnEditingEnabled)
        })
      );
    }
  }]);
  return EditingState;
}(React.PureComponent);

EditingState.propTypes = {
  createRowChange: PropTypes.func,
  columnEditingEnabled: PropTypes.bool,
  columnExtensions: PropTypes.array,

  editingRowIds: PropTypes.array,
  defaultEditingRowIds: PropTypes.array,
  onEditingRowIdsChange: PropTypes.func,

  addedRows: PropTypes.array,
  defaultAddedRows: PropTypes.array,
  onAddedRowsChange: PropTypes.func,

  rowChanges: PropTypes.object,
  defaultRowChanges: PropTypes.object,
  onRowChangesChange: PropTypes.func,

  deletedRowIds: PropTypes.array,
  defaultDeletedRowIds: PropTypes.array,
  onDeletedRowIdsChange: PropTypes.func,

  onCommitChanges: PropTypes.func.isRequired
};

EditingState.defaultProps = {
  createRowChange: undefined,
  columnEditingEnabled: true,
  columnExtensions: undefined,

  editingRowIds: undefined,
  defaultEditingRowIds: [],
  onEditingRowIdsChange: undefined,

  rowChanges: undefined,
  defaultRowChanges: {},
  onRowChangesChange: undefined,

  addedRows: undefined,
  defaultAddedRows: [],
  onAddedRowsChange: undefined,

  deletedRowIds: undefined,
  defaultDeletedRowIds: [],
  onDeletedRowIdsChange: undefined
};

var PagingState = function (_React$PureComponent) {
  inherits(PagingState, _React$PureComponent);

  function PagingState(props) {
    classCallCheck(this, PagingState);

    var _this = possibleConstructorReturn(this, (PagingState.__proto__ || Object.getPrototypeOf(PagingState)).call(this, props));

    _this.state = {
      currentPage: props.currentPage || props.defaultCurrentPage,
      pageSize: props.pageSize !== undefined ? props.pageSize : props.defaultPageSize
    };

    var stateHelper = dxReactCore.createStateHelper(_this, {
      currentPage: function currentPage$$1() {
        return _this.props.onCurrentPageChange;
      },
      pageSize: function pageSize() {
        return _this.props.onPageSizeChange;
      }
    });

    _this.setCurrentPage = stateHelper.applyFieldReducer.bind(stateHelper, 'currentPage', dxGridCore.setCurrentPage);
    _this.setPageSize = stateHelper.applyFieldReducer.bind(stateHelper, 'pageSize', dxGridCore.setPageSize);
    return _this;
  }

  createClass(PagingState, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var currentPage$$1 = nextProps.currentPage,
          pageSize = nextProps.pageSize;

      this.setState(_extends({}, currentPage$$1 !== undefined ? { currentPage: currentPage$$1 } : null, pageSize !== undefined ? { pageSize: pageSize } : null));
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          pageSize = _state.pageSize,
          currentPage$$1 = _state.currentPage;


      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'PagingState'
        },
        React.createElement(dxReactCore.Getter, { name: 'currentPage', value: currentPage$$1 }),
        React.createElement(dxReactCore.Getter, { name: 'pageSize', value: pageSize }),
        React.createElement(dxReactCore.Action, { name: 'setCurrentPage', action: this.setCurrentPage }),
        React.createElement(dxReactCore.Action, { name: 'setPageSize', action: this.setPageSize })
      );
    }
  }]);
  return PagingState;
}(React.PureComponent);

PagingState.propTypes = {
  pageSize: PropTypes.number,
  defaultPageSize: PropTypes.number,
  onPageSizeChange: PropTypes.func,
  currentPage: PropTypes.number,
  defaultCurrentPage: PropTypes.number,
  onCurrentPageChange: PropTypes.func
};

PagingState.defaultProps = {
  pageSize: undefined,
  defaultPageSize: 10,
  onPageSizeChange: undefined,
  currentPage: undefined,
  defaultCurrentPage: 0,
  onCurrentPageChange: undefined
};

var pluginDependencies$2 = [{ name: 'PagingState' }];

var rowsWithHeadersComputed = function rowsWithHeadersComputed(_ref) {
  var rows = _ref.rows,
      pageSize = _ref.pageSize,
      getRowLevelKey = _ref.getRowLevelKey;
  return dxGridCore.rowsWithPageHeaders(rows, pageSize, getRowLevelKey);
};
var totalCountComputed = function totalCountComputed(_ref2) {
  var rows = _ref2.rows;
  return dxGridCore.rowCount(rows);
};
var paginatedRowsComputed = function paginatedRowsComputed(_ref3) {
  var rows = _ref3.rows,
      pageSize = _ref3.pageSize,
      page = _ref3.currentPage;
  return dxGridCore.paginatedRows(rows, pageSize, page);
};
var currentPageComputed = function currentPageComputed(_ref4, _ref5) {
  var page = _ref4.currentPage,
      totalCount = _ref4.totalCount,
      pageSize = _ref4.pageSize;
  var setCurrentPage$$1 = _ref5.setCurrentPage;
  return dxGridCore.currentPage(page, totalCount, pageSize, setCurrentPage$$1);
};

// eslint-disable-next-line react/prefer-stateless-function
var IntegratedPaging = function (_React$PureComponent) {
  inherits(IntegratedPaging, _React$PureComponent);

  function IntegratedPaging() {
    classCallCheck(this, IntegratedPaging);
    return possibleConstructorReturn(this, (IntegratedPaging.__proto__ || Object.getPrototypeOf(IntegratedPaging)).apply(this, arguments));
  }

  createClass(IntegratedPaging, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'IntegratedPaging',
          dependencies: pluginDependencies$2
        },
        React.createElement(dxReactCore.Getter, { name: 'rows', computed: rowsWithHeadersComputed }),
        React.createElement(dxReactCore.Getter, { name: 'totalCount', computed: totalCountComputed }),
        React.createElement(dxReactCore.Getter, { name: 'currentPage', computed: currentPageComputed }),
        React.createElement(dxReactCore.Getter, { name: 'rows', computed: paginatedRowsComputed })
      );
    }
  }]);
  return IntegratedPaging;
}(React.PureComponent);

var pluginDependencies$3 = [{ name: 'PagingState' }];

var CustomPaging = function (_React$PureComponent) {
  inherits(CustomPaging, _React$PureComponent);

  function CustomPaging() {
    classCallCheck(this, CustomPaging);
    return possibleConstructorReturn(this, (CustomPaging.__proto__ || Object.getPrototypeOf(CustomPaging)).apply(this, arguments));
  }

  createClass(CustomPaging, [{
    key: 'render',
    value: function render() {
      var totalCount = this.props.totalCount;


      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'CustomPaging',
          dependencies: pluginDependencies$3
        },
        React.createElement(dxReactCore.Getter, { name: 'totalCount', value: totalCount })
      );
    }
  }]);
  return CustomPaging;
}(React.PureComponent);

CustomPaging.propTypes = {
  totalCount: PropTypes.number
};

CustomPaging.defaultProps = {
  totalCount: 0
};

var dependencies = [{ name: 'SortingState', optional: true }];

var columnExtensionValueGetter$2 = function columnExtensionValueGetter(columnExtensions, defaultValue) {
  return dxGridCore.getColumnExtensionValueGetter(columnExtensions, 'groupingEnabled', defaultValue);
};

var GroupingState = function (_React$PureComponent) {
  inherits(GroupingState, _React$PureComponent);

  function GroupingState(props) {
    classCallCheck(this, GroupingState);

    var _this = possibleConstructorReturn(this, (GroupingState.__proto__ || Object.getPrototypeOf(GroupingState)).call(this, props));

    _this.state = {
      grouping: props.grouping || props.defaultGrouping,
      draftGrouping: null,
      expandedGroups: props.expandedGroups || props.defaultExpandedGroups
    };

    _this.stateHelper = dxReactCore.createStateHelper(_this, {
      grouping: function grouping() {
        return _this.props.onGroupingChange;
      },
      expandedGroups: function expandedGroups() {
        return _this.props.onExpandedGroupsChange;
      }
    });

    _this.changeColumnGrouping = _this.changeColumnGrouping.bind(_this);
    _this.toggleGroupExpanded = _this.stateHelper.applyReducer.bind(_this.stateHelper, dxGridCore.toggleExpandedGroups);
    _this.draftColumnGrouping = _this.stateHelper.applyReducer.bind(_this.stateHelper, dxGridCore.draftColumnGrouping);
    _this.cancelColumnGroupingDraft = _this.stateHelper.applyReducer.bind(_this.stateHelper, dxGridCore.cancelColumnGroupingDraft);
    _this.changeColumnSorting = _this.changeColumnSorting.bind(_this);
    return _this;
  }

  createClass(GroupingState, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var grouping = nextProps.grouping,
          expandedGroups = nextProps.expandedGroups;

      this.setState(_extends({}, grouping !== undefined ? { grouping: grouping } : null, expandedGroups !== undefined ? { expandedGroups: expandedGroups } : null));
    }
  }, {
    key: 'changeColumnSorting',
    value: function changeColumnSorting$$1(_ref, _ref2, _ref3) {
      var sorting = _ref2.sorting;
      var _changeColumnSorting = _ref3.changeColumnSorting;
      var columnName = _ref.columnName,
          keepOther = _ref.keepOther,
          restParams = objectWithoutProperties(_ref, ['columnName', 'keepOther']);
      var grouping = this.state.grouping;

      var groupingIndex = grouping.findIndex(function (columnGrouping) {
        return columnGrouping.columnName === columnName;
      });
      if (groupingIndex === -1) {
        _changeColumnSorting(_extends({
          columnName: columnName,
          keepOther: keepOther || grouping.map(function (columnGrouping) {
            return columnGrouping.columnName;
          })
        }, restParams));
        return false;
      }

      var sortIndex = dxGridCore.adjustSortIndex(groupingIndex, grouping, sorting);
      _changeColumnSorting(_extends({
        columnName: columnName,
        keepOther: true,
        sortIndex: sortIndex
      }, restParams));
      return false;
    }
  }, {
    key: 'changeColumnGrouping',
    value: function changeColumnGrouping$$1(_ref4, getters, actions) {
      var columnName = _ref4.columnName,
          groupIndex = _ref4.groupIndex;

      this.stateHelper.applyReducer(dxGridCore.changeColumnGrouping, { columnName: columnName, groupIndex: groupIndex }, function (nextState, state) {
        var grouping = nextState.grouping;
        var prevGrouping = state.grouping;
        var sorting = getters.sorting;
        var changeColumnSorting$$1 = actions.changeColumnSorting;


        if (!sorting) return;

        var columnSortingIndex = sorting.findIndex(function (columnSorting) {
          return columnSorting.columnName === columnName;
        });
        var prevGroupingIndex = prevGrouping.findIndex(function (columnGrouping) {
          return columnGrouping.columnName === columnName;
        });
        var groupingIndex = grouping.findIndex(function (columnGrouping) {
          return columnGrouping.columnName === columnName;
        });

        if (columnSortingIndex === -1 || prevGroupingIndex === prevGrouping.length - 1 && groupingIndex === -1) return;

        var sortIndex = dxGridCore.adjustSortIndex(groupingIndex === -1 ? grouping.length : groupingIndex, grouping, sorting);

        if (columnSortingIndex === sortIndex) return;

        changeColumnSorting$$1(_extends({
          keepOther: true,
          sortIndex: sortIndex
        }, sorting[columnSortingIndex]));
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          grouping = _state.grouping,
          draftGrouping = _state.draftGrouping,
          expandedGroups = _state.expandedGroups;
      var _props = this.props,
          columnExtensions = _props.columnExtensions,
          columnGroupingEnabled = _props.columnGroupingEnabled;


      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'GroupingState',
          dependencies: dependencies
        },
        React.createElement(dxReactCore.Getter, { name: 'grouping', value: grouping }),
        React.createElement(dxReactCore.Getter, { name: 'draftGrouping', value: draftGrouping || grouping }),
        React.createElement(dxReactCore.Getter, {
          name: 'isColumnGroupingEnabled',
          value: columnExtensionValueGetter$2(columnExtensions, columnGroupingEnabled)
        }),
        React.createElement(dxReactCore.Action, { name: 'changeColumnGrouping', action: this.changeColumnGrouping }),
        React.createElement(dxReactCore.Action, { name: 'draftColumnGrouping', action: this.draftColumnGrouping }),
        React.createElement(dxReactCore.Action, { name: 'cancelColumnGroupingDraft', action: this.cancelColumnGroupingDraft }),
        React.createElement(dxReactCore.Getter, { name: 'expandedGroups', value: expandedGroups }),
        React.createElement(dxReactCore.Action, { name: 'toggleGroupExpanded', action: this.toggleGroupExpanded }),
        React.createElement(dxReactCore.Action, { name: 'changeColumnSorting', action: this.changeColumnSorting })
      );
    }
  }]);
  return GroupingState;
}(React.PureComponent);

GroupingState.propTypes = {
  grouping: PropTypes.array,
  defaultGrouping: PropTypes.array,
  onGroupingChange: PropTypes.func,
  expandedGroups: PropTypes.array,
  defaultExpandedGroups: PropTypes.array,
  onExpandedGroupsChange: PropTypes.func,
  columnExtensions: PropTypes.array,
  columnGroupingEnabled: PropTypes.bool
};

GroupingState.defaultProps = {
  grouping: undefined,
  defaultGrouping: [],
  onGroupingChange: undefined,
  expandedGroups: undefined,
  defaultExpandedGroups: [],
  onExpandedGroupsChange: undefined,
  columnExtensions: undefined,
  columnGroupingEnabled: true
};

var pluginDependencies$4 = [{ name: 'GroupingState' }];

var getCollapsedRowsComputed$1 = function getCollapsedRowsComputed(_ref) {
  var getCollapsedRows = _ref.getCollapsedRows;
  return dxGridCore.groupCollapsedRowsGetter(getCollapsedRows);
};
var expandedGroupedRowsComputed = function expandedGroupedRowsComputed(_ref2) {
  var rows = _ref2.rows,
      grouping = _ref2.grouping,
      expandedGroups = _ref2.expandedGroups;
  return dxGridCore.expandedGroupRows(rows, grouping, expandedGroups);
};

var IntegratedGrouping = function (_React$PureComponent) {
  inherits(IntegratedGrouping, _React$PureComponent);

  function IntegratedGrouping() {
    classCallCheck(this, IntegratedGrouping);
    return possibleConstructorReturn(this, (IntegratedGrouping.__proto__ || Object.getPrototypeOf(IntegratedGrouping)).apply(this, arguments));
  }

  createClass(IntegratedGrouping, [{
    key: 'render',
    value: function render() {
      var columnExtensions = this.props.columnExtensions;

      var getColumnCriteria = function getColumnCriteria(columnName) {
        return dxGridCore.getColumnExtension(columnExtensions, columnName).criteria;
      };

      var groupedRowsComputed = function groupedRowsComputed(_ref3) {
        var rows = _ref3.rows,
            grouping = _ref3.grouping,
            getCellValue = _ref3.getCellValue;
        return dxGridCore.groupedRows(rows, grouping, getCellValue, getColumnCriteria);
      };

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'IntegratedGrouping',
          dependencies: pluginDependencies$4
        },
        React.createElement(dxReactCore.Getter, { name: 'isGroupRow', value: dxGridCore.groupRowChecker }),
        React.createElement(dxReactCore.Getter, { name: 'getRowLevelKey', value: dxGridCore.groupRowLevelKeyGetter }),
        React.createElement(dxReactCore.Getter, { name: 'getCollapsedRows', computed: getCollapsedRowsComputed$1 }),
        React.createElement(dxReactCore.Getter, { name: 'rows', computed: groupedRowsComputed }),
        React.createElement(dxReactCore.Getter, { name: 'rows', computed: expandedGroupedRowsComputed })
      );
    }
  }]);
  return IntegratedGrouping;
}(React.PureComponent);

IntegratedGrouping.propTypes = {
  columnExtensions: PropTypes.array
};

IntegratedGrouping.defaultProps = {
  columnExtensions: undefined
};

var pluginDependencies$5 = [{ name: 'GroupingState' }];

var getCollapsedRowsComputed$2 = function getCollapsedRowsComputed(_ref) {
  var getCollapsedRows = _ref.getCollapsedRows;
  return dxGridCore.groupCollapsedRowsGetter(getCollapsedRows);
};
var expandedGroupedRowsComputed$1 = function expandedGroupedRowsComputed(_ref2) {
  var rows = _ref2.rows,
      grouping = _ref2.grouping,
      expandedGroups = _ref2.expandedGroups;
  return dxGridCore.expandedGroupRows(rows, grouping, expandedGroups);
};
var getRowIdComputed = function getRowIdComputed(_ref3) {
  var getRowId = _ref3.getRowId,
      rows = _ref3.rows;
  return dxGridCore.customGroupingRowIdGetter(getRowId, rows);
};

var CustomGrouping = function (_React$PureComponent) {
  inherits(CustomGrouping, _React$PureComponent);

  function CustomGrouping() {
    classCallCheck(this, CustomGrouping);
    return possibleConstructorReturn(this, (CustomGrouping.__proto__ || Object.getPrototypeOf(CustomGrouping)).apply(this, arguments));
  }

  createClass(CustomGrouping, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          getChildGroups = _props.getChildGroups,
          appliedGrouping = _props.grouping,
          appliedExpandedGroups = _props.expandedGroups;

      var groupedRowsComputed = function groupedRowsComputed(_ref4) {
        var rows = _ref4.rows,
            grouping = _ref4.grouping;
        return dxGridCore.customGroupedRows(rows, grouping, getChildGroups);
      };

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'CustomGrouping',
          dependencies: pluginDependencies$5
        },
        appliedGrouping && React.createElement(dxReactCore.Getter, { name: 'grouping', value: appliedGrouping }),
        appliedExpandedGroups && React.createElement(dxReactCore.Getter, { name: 'expandedGroups', value: appliedExpandedGroups }),
        React.createElement(dxReactCore.Getter, { name: 'isGroupRow', value: dxGridCore.groupRowChecker }),
        React.createElement(dxReactCore.Getter, { name: 'getRowLevelKey', value: dxGridCore.groupRowLevelKeyGetter }),
        React.createElement(dxReactCore.Getter, { name: 'getCollapsedRows', computed: getCollapsedRowsComputed$2 }),
        React.createElement(dxReactCore.Getter, { name: 'rows', computed: groupedRowsComputed }),
        React.createElement(dxReactCore.Getter, { name: 'getRowId', computed: getRowIdComputed }),
        React.createElement(dxReactCore.Getter, { name: 'rows', computed: expandedGroupedRowsComputed$1 })
      );
    }
  }]);
  return CustomGrouping;
}(React.PureComponent);

CustomGrouping.propTypes = {
  getChildGroups: PropTypes.func.isRequired,
  grouping: PropTypes.array,
  expandedGroups: PropTypes.array
};

CustomGrouping.defaultProps = {
  grouping: undefined,
  expandedGroups: undefined
};

var SelectionState = function (_React$PureComponent) {
  inherits(SelectionState, _React$PureComponent);

  function SelectionState(props) {
    classCallCheck(this, SelectionState);

    var _this = possibleConstructorReturn(this, (SelectionState.__proto__ || Object.getPrototypeOf(SelectionState)).call(this, props));

    _this.state = {
      selection: props.selection || props.defaultSelection
    };

    var stateHelper = dxReactCore.createStateHelper(_this, {
      selection: function selection() {
        return _this.props.onSelectionChange;
      }
    });

    _this.toggleSelection = stateHelper.applyFieldReducer.bind(stateHelper, 'selection', dxGridCore.toggleSelection);
    return _this;
  }

  createClass(SelectionState, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var selection = nextProps.selection;

      this.setState(_extends({}, selection !== undefined ? { selection: selection } : null));
    }
  }, {
    key: 'render',
    value: function render() {
      var selection = this.state.selection;


      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'SelectionState'
        },
        React.createElement(dxReactCore.Getter, { name: 'selection', value: selection }),
        React.createElement(dxReactCore.Action, { name: 'toggleSelection', action: this.toggleSelection })
      );
    }
  }]);
  return SelectionState;
}(React.PureComponent);

SelectionState.propTypes = {
  selection: PropTypes.array,
  defaultSelection: PropTypes.array,
  onSelectionChange: PropTypes.func
};

SelectionState.defaultProps = {
  selection: undefined,
  defaultSelection: [],
  onSelectionChange: undefined
};

var rowsWithAvailableToSelectComputed = function rowsWithAvailableToSelectComputed(_ref) {
  var rows = _ref.rows,
      getRowId = _ref.getRowId,
      isGroupRow = _ref.isGroupRow;
  return dxGridCore.rowsWithAvailableToSelect(rows, getRowId, isGroupRow);
};
var allSelectedComputed = function allSelectedComputed(_ref2) {
  var rows = _ref2.rows,
      selection = _ref2.selection;
  return dxGridCore.allSelected(rows, selection);
};
var someSelectedComputed = function someSelectedComputed(_ref3) {
  var rows = _ref3.rows,
      selection = _ref3.selection;
  return dxGridCore.someSelected(rows, selection);
};
var selectAllAvailableComputed = function selectAllAvailableComputed(_ref4) {
  var availableToSelect = _ref4.rows.availableToSelect;
  return !!availableToSelect.length;
};
var toggleSelectAll = function toggleSelectAll(state, _ref5, _ref6) {
  var availableToSelect = _ref5.rows.availableToSelect;
  var toggleSelection$$1 = _ref6.toggleSelection;

  toggleSelection$$1({ rowIds: availableToSelect, state: state });
};
var unwrapRowsComputed = function unwrapRowsComputed(_ref7) {
  var rows = _ref7.rows;
  return dxGridCore.unwrapSelectedRows(rows);
};

var pluginDependencies$6 = [{ name: 'SelectionState' }];

// eslint-disable-next-line react/prefer-stateless-function
var IntegratedSelection = function (_React$PureComponent) {
  inherits(IntegratedSelection, _React$PureComponent);

  function IntegratedSelection() {
    classCallCheck(this, IntegratedSelection);
    return possibleConstructorReturn(this, (IntegratedSelection.__proto__ || Object.getPrototypeOf(IntegratedSelection)).apply(this, arguments));
  }

  createClass(IntegratedSelection, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'IntegratedSelection',
          dependencies: pluginDependencies$6
        },
        React.createElement(dxReactCore.Getter, { name: 'rows', computed: rowsWithAvailableToSelectComputed }),
        React.createElement(dxReactCore.Getter, { name: 'allSelected', computed: allSelectedComputed }),
        React.createElement(dxReactCore.Getter, { name: 'someSelected', computed: someSelectedComputed }),
        React.createElement(dxReactCore.Getter, { name: 'selectAllAvailable', computed: selectAllAvailableComputed }),
        React.createElement(dxReactCore.Action, { name: 'toggleSelectAll', action: toggleSelectAll }),
        React.createElement(dxReactCore.Getter, { name: 'rows', computed: unwrapRowsComputed })
      );
    }
  }]);
  return IntegratedSelection;
}(React.PureComponent);

var columnExtensionValueGetter$3 = function columnExtensionValueGetter(columnExtensions, defaultValue) {
  return dxGridCore.getColumnExtensionValueGetter(columnExtensions, 'sortingEnabled', defaultValue);
};

var SortingState = function (_React$PureComponent) {
  inherits(SortingState, _React$PureComponent);

  function SortingState(props) {
    classCallCheck(this, SortingState);

    var _this = possibleConstructorReturn(this, (SortingState.__proto__ || Object.getPrototypeOf(SortingState)).call(this, props));

    _this.state = {
      sorting: props.sorting || props.defaultSorting
    };

    var persistentSortedColumns = dxGridCore.getPersistentSortedColumns(_this.state.sorting, props.columnExtensions);

    var stateHelper = dxReactCore.createStateHelper(_this, {
      sorting: function sorting() {
        return _this.props.onSortingChange;
      }
    });

    _this.changeColumnSorting = stateHelper.applyReducer.bind(stateHelper, function (prevState, payload) {
      var keepOther = dxGridCore.calculateKeepOther(prevState.sorting, payload.keepOther, persistentSortedColumns);
      return dxGridCore.changeColumnSorting(prevState, _extends({}, payload, { keepOther: keepOther }));
    });
    return _this;
  }

  createClass(SortingState, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var sorting = nextProps.sorting;

      this.setState(_extends({}, sorting !== undefined ? { sorting: sorting } : null));
    }
  }, {
    key: 'render',
    value: function render() {
      var sorting = this.state.sorting;
      var _props = this.props,
          columnExtensions = _props.columnExtensions,
          columnSortingEnabled = _props.columnSortingEnabled;


      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'SortingState'
        },
        React.createElement(dxReactCore.Getter, { name: 'sorting', value: sorting }),
        React.createElement(dxReactCore.Getter, {
          name: 'isColumnSortingEnabled',
          value: columnExtensionValueGetter$3(columnExtensions, columnSortingEnabled)
        }),
        React.createElement(dxReactCore.Action, { name: 'changeColumnSorting', action: this.changeColumnSorting })
      );
    }
  }]);
  return SortingState;
}(React.PureComponent);

SortingState.propTypes = {
  sorting: PropTypes.array,
  defaultSorting: PropTypes.array,
  onSortingChange: PropTypes.func,
  columnExtensions: PropTypes.array,
  columnSortingEnabled: PropTypes.bool
};

SortingState.defaultProps = {
  sorting: undefined,
  defaultSorting: [],
  onSortingChange: undefined,
  columnExtensions: undefined,
  columnSortingEnabled: true
};

var pluginDependencies$7 = [{ name: 'SortingState' }];

var IntegratedSorting = function (_React$PureComponent) {
  inherits(IntegratedSorting, _React$PureComponent);

  function IntegratedSorting() {
    classCallCheck(this, IntegratedSorting);
    return possibleConstructorReturn(this, (IntegratedSorting.__proto__ || Object.getPrototypeOf(IntegratedSorting)).apply(this, arguments));
  }

  createClass(IntegratedSorting, [{
    key: 'render',
    value: function render() {
      var columnExtensions = this.props.columnExtensions;

      var getColumnCompare = function getColumnCompare(columnName) {
        return dxGridCore.getColumnExtension(columnExtensions, columnName).compare;
      };

      var rowsComputed = function rowsComputed(_ref) {
        var rows = _ref.rows,
            sorting = _ref.sorting,
            getCellValue = _ref.getCellValue,
            isGroupRow = _ref.isGroupRow,
            getRowLevelKey = _ref.getRowLevelKey;
        return dxGridCore.sortedRows(rows, sorting, getCellValue, getColumnCompare, isGroupRow, getRowLevelKey);
      };

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'IntegratedSorting',
          dependencies: pluginDependencies$7
        },
        React.createElement(dxReactCore.Getter, { name: 'rows', computed: rowsComputed })
      );
    }
  }]);
  return IntegratedSorting;
}(React.PureComponent);

IntegratedSorting.propTypes = {
  columnExtensions: PropTypes.array
};

IntegratedSorting.defaultProps = {
  columnExtensions: undefined
};

var getTargetColumns = function getTargetColumns(payload, columns) {
  return payload.filter(function (item) {
    return item.type === 'column';
  }).map(function (item) {
    return columns.find(function (column) {
      return column.name === item.columnName;
    });
  });
};

var DragDropProvider$1 = function (_React$PureComponent) {
  inherits(DragDropProvider$$1, _React$PureComponent);

  function DragDropProvider$$1(props) {
    classCallCheck(this, DragDropProvider$$1);

    var _this = possibleConstructorReturn(this, (DragDropProvider$$1.__proto__ || Object.getPrototypeOf(DragDropProvider$$1)).call(this, props));

    _this.state = {
      payload: null,
      clientOffset: null
    };

    _this.change = function (_ref) {
      var payload = _ref.payload,
          clientOffset = _ref.clientOffset;
      return _this.setState({ payload: payload, clientOffset: clientOffset });
    };
    return _this;
  }

  createClass(DragDropProvider$$1, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          Container = _props.containerComponent,
          Column = _props.columnComponent;
      var _state = this.state,
          payload = _state.payload,
          clientOffset = _state.clientOffset;


      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'DragDropProvider'
        },
        React.createElement(dxReactCore.Getter, { name: 'draggingEnabled', value: true }),
        React.createElement(
          dxReactCore.Template,
          { name: 'root' },
          React.createElement(
            dxReactCore.DragDropProvider,
            {
              onChange: this.change
            },
            React.createElement(dxReactCore.TemplatePlaceholder, null)
          ),
          payload && React.createElement(
            dxReactCore.TemplateConnector,
            null,
            function (_ref2) {
              var columns = _ref2.columns;
              return React.createElement(
                Container,
                {
                  clientOffset: clientOffset
                },
                getTargetColumns(payload, columns).map(function (column) {
                  return React.createElement(Column, {
                    key: column.name,
                    column: column
                  });
                })
              );
            }
          )
        )
      );
    }
  }]);
  return DragDropProvider$$1;
}(React.PureComponent);

DragDropProvider$1.propTypes = {
  containerComponent: PropTypes.func.isRequired,
  columnComponent: PropTypes.func.isRequired
};

var pluginDependencies$8 = [{ name: 'Table' }];

var tableHeaderRowsComputed = function tableHeaderRowsComputed(_ref) {
  var tableHeaderRows = _ref.tableHeaderRows;
  return dxGridCore.tableHeaderRowsWithReordering(tableHeaderRows);
};

var TableColumnReordering = function (_React$PureComponent) {
  inherits(TableColumnReordering, _React$PureComponent);

  function TableColumnReordering(props) {
    classCallCheck(this, TableColumnReordering);

    var _this = possibleConstructorReturn(this, (TableColumnReordering.__proto__ || Object.getPrototypeOf(TableColumnReordering)).call(this, props));

    _this.state = {
      order: props.defaultOrder,
      sourceColumnIndex: -1,
      targetColumnIndex: -1
    };

    _this.onOver = _this.handleOver.bind(_this);
    _this.onLeave = _this.handleLeave.bind(_this);
    _this.onDrop = _this.handleDrop.bind(_this);
    return _this;
  }

  createClass(TableColumnReordering, [{
    key: 'getState',
    value: function getState() {
      var _props$order = this.props.order,
          order = _props$order === undefined ? this.state.order : _props$order;

      return _extends({}, this.state, {
        order: order
      });
    }
  }, {
    key: 'getDraftOrder',
    value: function getDraftOrder() {
      var _getState = this.getState(),
          order = _getState.order,
          sourceColumnIndex = _getState.sourceColumnIndex,
          targetColumnIndex = _getState.targetColumnIndex;

      return dxGridCore.draftOrder(order, sourceColumnIndex, targetColumnIndex);
    }
  }, {
    key: 'getAvailableColumns',
    value: function getAvailableColumns() {
      var _this2 = this;

      return this.getDraftOrder().filter(function (columnName) {
        return !!_this2.cellDimensionGetters[columnName];
      });
    }
  }, {
    key: 'cacheCellDimensions',
    value: function cacheCellDimensions() {
      var _this3 = this;

      this.cellDimensions = this.cellDimensions && this.cellDimensions.length ? this.cellDimensions : this.getAvailableColumns().map(function (columnName) {
        return _this3.cellDimensionGetters[columnName]();
      });
    }
  }, {
    key: 'resetCellDimensions',
    value: function resetCellDimensions() {
      this.cellDimensions = [];
    }
  }, {
    key: 'ensureCellDimensionGetters',
    value: function ensureCellDimensionGetters(tableColumns) {
      var _this4 = this;

      Object.keys(this.cellDimensionGetters).forEach(function (columnName) {
        var columnIndex = tableColumns.findIndex(function (_ref2) {
          var type = _ref2.type,
              column = _ref2.column;
          return type === dxGridCore.TABLE_DATA_TYPE && column.name === columnName;
        });
        if (columnIndex === -1) {
          delete _this4.cellDimensionGetters[columnName];
        }
      });
    }
  }, {
    key: 'storeCellDimensionsGetter',
    value: function storeCellDimensionsGetter(tableColumn, getter, tableColumns) {
      if (tableColumn.type === dxGridCore.TABLE_DATA_TYPE) {
        this.cellDimensionGetters[tableColumn.column.name] = getter;
      }
      this.ensureCellDimensionGetters(tableColumns);
    }
  }, {
    key: 'handleOver',
    value: function handleOver(_ref3) {
      var payload = _ref3.payload,
          x = _ref3.clientOffset.x;

      var sourceColumnName = payload[0].columnName;
      var availableColumns = this.getAvailableColumns();
      var relativeSourceColumnIndex = availableColumns.indexOf(sourceColumnName);

      if (relativeSourceColumnIndex === -1) return;

      this.cacheCellDimensions();
      var cellDimensions = this.cellDimensions;


      var overlappedColumns = cellDimensions.filter(function (_ref4) {
        var left = _ref4.left,
            right = _ref4.right;
        return left <= x && x <= right;
      });

      if (overlappedColumns.length > 1) return;

      var relativeTargetIndex = dxGridCore.getTableTargetColumnIndex(cellDimensions, relativeSourceColumnIndex, x);

      if (relativeTargetIndex === -1) return;

      var _getState2 = this.getState(),
          prevSourceColumnIndex = _getState2.sourceColumnIndex,
          prevTargetColumnIndex = _getState2.targetColumnIndex;

      var draftOrder$$1 = this.getDraftOrder();
      var targetColumnIndex = draftOrder$$1.indexOf(availableColumns[relativeTargetIndex]);

      if (targetColumnIndex === prevTargetColumnIndex) return;

      var sourceColumnIndex = prevSourceColumnIndex === -1 ? draftOrder$$1.indexOf(sourceColumnName) : prevSourceColumnIndex;

      this.setState({
        sourceColumnIndex: sourceColumnIndex,
        targetColumnIndex: targetColumnIndex
      });
    }
  }, {
    key: 'handleLeave',
    value: function handleLeave() {
      this.setState({
        sourceColumnIndex: -1,
        targetColumnIndex: -1
      });

      this.resetCellDimensions();
    }
  }, {
    key: 'handleDrop',
    value: function handleDrop() {
      var _getState3 = this.getState(),
          sourceColumnIndex = _getState3.sourceColumnIndex,
          targetColumnIndex = _getState3.targetColumnIndex,
          order = _getState3.order;

      var onOrderChange = this.props.onOrderChange;

      var nextOrder = dxGridCore.changeColumnOrder(order, {
        sourceColumnName: order[sourceColumnIndex],
        targetColumnName: order[targetColumnIndex]
      });

      this.setState({
        order: nextOrder,
        sourceColumnIndex: -1,
        targetColumnIndex: -1
      });

      if (onOrderChange) {
        onOrderChange(nextOrder);
      }

      this.resetCellDimensions();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _props = this.props,
          Container = _props.tableContainerComponent,
          Row = _props.rowComponent,
          Cell = _props.cellComponent;


      var columnsComputed = function columnsComputed(_ref5) {
        var tableColumns = _ref5.tableColumns;
        return dxGridCore.orderedColumns(tableColumns, _this5.getDraftOrder());
      };

      this.cellDimensionGetters = {};

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'TableColumnReordering',
          dependencies: pluginDependencies$8
        },
        React.createElement(dxReactCore.Getter, { name: 'tableColumns', computed: columnsComputed }),
        React.createElement(dxReactCore.Getter, { name: 'tableHeaderRows', computed: tableHeaderRowsComputed }),
        React.createElement(
          dxReactCore.Template,
          { name: 'table' },
          function (params) {
            return React.createElement(
              Container,
              _extends({}, params, {
                onOver: _this5.onOver,
                onLeave: _this5.onLeave,
                onDrop: _this5.onDrop
              }),
              React.createElement(dxReactCore.TemplatePlaceholder, null)
            );
          }
        ),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableRow',
            predicate: function predicate(_ref6) {
              var tableRow = _ref6.tableRow;
              return tableRow.type === dxGridCore.TABLE_REORDERING_TYPE;
            }
          },
          function (params) {
            return React.createElement(Row, params);
          }
        ),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableCell',
            predicate: function predicate(_ref7) {
              var tableRow = _ref7.tableRow;
              return tableRow.type === dxGridCore.TABLE_REORDERING_TYPE;
            }
          },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (_ref8) {
                var tableColumns = _ref8.tableColumns;
                return React.createElement(Cell, _extends({}, params, {
                  getCellDimensions: function getCellDimensions(getter) {
                    return _this5.storeCellDimensionsGetter(params.tableColumn, getter, tableColumns);
                  }
                }));
              }
            );
          }
        )
      );
    }
  }]);
  return TableColumnReordering;
}(React.PureComponent);

TableColumnReordering.propTypes = {
  order: PropTypes.arrayOf(PropTypes.string),
  defaultOrder: PropTypes.arrayOf(PropTypes.string),
  onOrderChange: PropTypes.func,
  tableContainerComponent: PropTypes.func.isRequired,
  rowComponent: PropTypes.func.isRequired,
  cellComponent: PropTypes.func.isRequired
};

TableColumnReordering.defaultProps = {
  order: undefined,
  defaultOrder: [],
  onOrderChange: undefined
};

var RowPlaceholder = function RowPlaceholder(props) {
  return React.createElement(dxReactCore.TemplatePlaceholder, { name: 'tableRow', params: props });
};
var CellPlaceholder = function CellPlaceholder(props) {
  return React.createElement(dxReactCore.TemplatePlaceholder, { name: 'tableCell', params: props });
};

var tableHeaderRows = [];
var tableBodyRowsComputed = function tableBodyRowsComputed(_ref) {
  var rows = _ref.rows,
      getRowId = _ref.getRowId;
  return dxGridCore.tableRowsWithDataRows(rows, getRowId);
};

var pluginDependencies$9 = [{ name: 'DataTypeProvider', optional: true }];

var Table = function (_React$PureComponent) {
  inherits(Table, _React$PureComponent);

  function Table() {
    classCallCheck(this, Table);
    return possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).apply(this, arguments));
  }

  createClass(Table, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          Layout = _props.layoutComponent,
          Cell = _props.cellComponent,
          Row = _props.rowComponent,
          NoDataRow = _props.noDataRowComponent,
          NoDataCell = _props.noDataCellComponent,
          StubRow = _props.stubRowComponent,
          StubCell = _props.stubCellComponent,
          StubHeaderCell = _props.stubHeaderCellComponent,
          columnExtensions = _props.columnExtensions,
          messages = _props.messages,
          containerComponent = _props.containerComponent,
          tableComponent = _props.tableComponent,
          headComponent = _props.headComponent,
          bodyComponent = _props.bodyComponent;


      var getMessage = dxGridCore.getMessagesFormatter(messages);
      var tableColumnsComputed = function tableColumnsComputed(_ref2) {
        var columns = _ref2.columns;
        return dxGridCore.tableColumnsWithDataRows(columns, columnExtensions);
      };

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'Table',
          dependencies: pluginDependencies$9
        },
        React.createElement(dxReactCore.Getter, { name: 'tableHeaderRows', value: tableHeaderRows }),
        React.createElement(dxReactCore.Getter, { name: 'tableBodyRows', computed: tableBodyRowsComputed }),
        React.createElement(dxReactCore.Getter, { name: 'tableColumns', computed: tableColumnsComputed }),
        React.createElement(dxReactCore.Getter, { name: 'getTableCellColSpan', value: dxGridCore.tableCellColSpanGetter }),
        React.createElement(
          dxReactCore.Template,
          { name: 'body' },
          React.createElement(dxReactCore.TemplatePlaceholder, { name: 'table' })
        ),
        React.createElement(
          dxReactCore.Template,
          { name: 'table' },
          React.createElement(
            dxReactCore.TemplateConnector,
            null,
            function (_ref3) {
              var headerRows = _ref3.tableHeaderRows,
                  bodyRows = _ref3.tableBodyRows,
                  columns = _ref3.tableColumns,
                  getTableCellColSpan = _ref3.getTableCellColSpan;
              return React.createElement(Layout, {
                tableComponent: tableComponent,
                headComponent: headComponent,
                bodyComponent: bodyComponent,
                containerComponent: containerComponent,
                headerRows: headerRows,
                bodyRows: bodyRows,
                columns: columns,
                rowComponent: RowPlaceholder,
                cellComponent: CellPlaceholder,
                getCellColSpan: getTableCellColSpan
              });
            }
          )
        ),
        React.createElement(
          dxReactCore.Template,
          { name: 'tableCell' },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (_ref4) {
                var headerRows = _ref4.tableHeaderRows;
                return dxGridCore.isHeaderStubTableCell(params.tableRow, headerRows) ? React.createElement(StubHeaderCell, params) : React.createElement(StubCell, params);
              }
            );
          }
        ),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableCell',
            predicate: function predicate(_ref5) {
              var tableRow = _ref5.tableRow,
                  tableColumn = _ref5.tableColumn;
              return dxGridCore.isDataTableCell(tableRow, tableColumn);
            }
          },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (_ref6) {
                var getCellValue = _ref6.getCellValue;

                var columnName = params.tableColumn.column.name;
                var value = getCellValue(params.tableRow.row, columnName);
                return React.createElement(
                  dxReactCore.TemplatePlaceholder,
                  {
                    name: 'valueFormatter',
                    params: {
                      row: params.tableRow.row,
                      column: params.tableColumn.column,
                      value: value
                    }
                  },
                  function (content) {
                    return React.createElement(
                      Cell,
                      _extends({}, params, {
                        row: params.tableRow.row,
                        column: params.tableColumn.column,
                        value: value
                      }),
                      content
                    );
                  }
                );
              }
            );
          }
        ),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableCell',
            predicate: function predicate(_ref7) {
              var tableRow = _ref7.tableRow;
              return dxGridCore.isNoDataTableRow(tableRow);
            }
          },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (_ref8) {
                var tableColumns = _ref8.tableColumns;

                if (dxGridCore.isNoDataTableCell(params.tableColumn, tableColumns)) {
                  return React.createElement(NoDataCell, _extends({}, params, {
                    getMessage: getMessage
                  }));
                }
                return null;
              }
            );
          }
        ),
        React.createElement(
          dxReactCore.Template,
          { name: 'tableRow' },
          function (params) {
            return React.createElement(StubRow, params);
          }
        ),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableRow',
            predicate: function predicate(_ref9) {
              var tableRow = _ref9.tableRow;
              return dxGridCore.isDataTableRow(tableRow);
            }
          },
          function (params) {
            return React.createElement(Row, _extends({}, params, {
              row: params.tableRow.row
            }));
          }
        ),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableRow',
            predicate: function predicate(_ref10) {
              var tableRow = _ref10.tableRow;
              return dxGridCore.isNoDataTableRow(tableRow);
            }
          },
          function (params) {
            return React.createElement(NoDataRow, params);
          }
        )
      );
    }
  }]);
  return Table;
}(React.PureComponent);

Table.propTypes = {
  layoutComponent: PropTypes.func.isRequired,
  tableComponent: PropTypes.func.isRequired,
  headComponent: PropTypes.func.isRequired,
  bodyComponent: PropTypes.func.isRequired,
  containerComponent: PropTypes.func.isRequired,
  cellComponent: PropTypes.func.isRequired,
  rowComponent: PropTypes.func.isRequired,
  noDataCellComponent: PropTypes.func.isRequired,
  noDataRowComponent: PropTypes.func.isRequired,
  stubRowComponent: PropTypes.func.isRequired,
  stubCellComponent: PropTypes.func.isRequired,
  stubHeaderCellComponent: PropTypes.func.isRequired,
  columnExtensions: PropTypes.array,
  messages: PropTypes.object
};

Table.defaultProps = {
  columnExtensions: undefined,
  messages: {}
};

var TableSelection = function (_React$PureComponent) {
  inherits(TableSelection, _React$PureComponent);

  function TableSelection() {
    classCallCheck(this, TableSelection);
    return possibleConstructorReturn(this, (TableSelection.__proto__ || Object.getPrototypeOf(TableSelection)).apply(this, arguments));
  }

  createClass(TableSelection, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          highlightRow = _props.highlightRow,
          selectByRowClick = _props.selectByRowClick,
          showSelectionColumn = _props.showSelectionColumn,
          showSelectAll = _props.showSelectAll,
          HeaderCell = _props.headerCellComponent,
          Cell = _props.cellComponent,
          Row = _props.rowComponent,
          selectionColumnWidth = _props.selectionColumnWidth;


      var tableColumnsComputed = function tableColumnsComputed(_ref) {
        var tableColumns = _ref.tableColumns;
        return dxGridCore.tableColumnsWithSelection(tableColumns, selectionColumnWidth);
      };

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'TableSelection',
          dependencies: [{ name: 'Table' }, { name: 'SelectionState' }, { name: 'IntegratedSelection', optional: !showSelectAll }]
        },
        showSelectionColumn && React.createElement(dxReactCore.Getter, { name: 'tableColumns', computed: tableColumnsComputed }),
        showSelectionColumn && showSelectAll && React.createElement(
          dxReactCore.Template,
          {
            name: 'tableCell',
            predicate: function predicate(_ref2) {
              var tableRow = _ref2.tableRow,
                  tableColumn = _ref2.tableColumn;
              return dxGridCore.isSelectAllTableCell(tableRow, tableColumn);
            }
          },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (_ref3, _ref4) {
                var selectAllAvailable = _ref3.selectAllAvailable,
                    allSelected$$1 = _ref3.allSelected,
                    someSelected$$1 = _ref3.someSelected;
                var toggleSelectAll = _ref4.toggleSelectAll;
                return React.createElement(HeaderCell, _extends({}, params, {
                  disabled: !selectAllAvailable,
                  allSelected: allSelected$$1,
                  someSelected: someSelected$$1,
                  onToggle: function onToggle(select) {
                    return toggleSelectAll(select);
                  }
                }));
              }
            );
          }
        ),
        showSelectionColumn && React.createElement(
          dxReactCore.Template,
          {
            name: 'tableCell',
            predicate: function predicate(_ref5) {
              var tableRow = _ref5.tableRow,
                  tableColumn = _ref5.tableColumn;
              return dxGridCore.isSelectTableCell(tableRow, tableColumn);
            }
          },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (_ref6, _ref7) {
                var selection = _ref6.selection;
                var toggleSelection$$1 = _ref7.toggleSelection;
                return React.createElement(Cell, _extends({}, params, {
                  row: params.tableRow.row,
                  selected: selection.indexOf(params.tableRow.rowId) !== -1,
                  onToggle: function onToggle() {
                    return toggleSelection$$1({ rowIds: [params.tableRow.rowId] });
                  }
                }));
              }
            );
          }
        ),
        (highlightRow || selectByRowClick) && React.createElement(
          dxReactCore.Template,
          {
            name: 'tableRow',
            predicate: function predicate(_ref8) {
              var tableRow = _ref8.tableRow;
              return dxGridCore.isDataTableRow(tableRow);
            }
          },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (_ref9, _ref10) {
                var selection = _ref9.selection;
                var toggleSelection$$1 = _ref10.toggleSelection;
                return React.createElement(Row, _extends({}, params, {
                  selectByRowClick: selectByRowClick,
                  selected: highlightRow && selection.indexOf(params.tableRow.rowId) !== -1,
                  onToggle: function onToggle() {
                    return toggleSelection$$1({ rowIds: [params.tableRow.rowId] });
                  }
                }));
              }
            );
          }
        )
      );
    }
  }]);
  return TableSelection;
}(React.PureComponent);

TableSelection.propTypes = {
  headerCellComponent: PropTypes.func.isRequired,
  cellComponent: PropTypes.func.isRequired,
  rowComponent: PropTypes.func.isRequired,
  highlightRow: PropTypes.bool,
  selectByRowClick: PropTypes.bool,
  showSelectAll: PropTypes.bool,
  showSelectionColumn: PropTypes.bool,
  selectionColumnWidth: PropTypes.number.isRequired
};

TableSelection.defaultProps = {
  highlightRow: false,
  selectByRowClick: false,
  showSelectAll: false,
  showSelectionColumn: true
};

var RowDetailState = function (_React$PureComponent) {
  inherits(RowDetailState, _React$PureComponent);

  function RowDetailState(props) {
    classCallCheck(this, RowDetailState);

    var _this = possibleConstructorReturn(this, (RowDetailState.__proto__ || Object.getPrototypeOf(RowDetailState)).call(this, props));

    _this.state = {
      expandedRowIds: props.expandedRowIds || props.defaultExpandedRowIds
    };

    var stateHelper = dxReactCore.createStateHelper(_this, {
      expandedRowIds: function expandedRowIds() {
        return _this.props.onExpandedRowIdsChange;
      }
    });

    _this.toggleDetailRowExpanded = stateHelper.applyFieldReducer.bind(stateHelper, 'expandedRowIds', dxGridCore.toggleDetailRowExpanded);
    return _this;
  }

  createClass(RowDetailState, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var expandedRowIds = nextProps.expandedRowIds;

      this.setState(_extends({}, expandedRowIds !== undefined ? { expandedRowIds: expandedRowIds } : null));
    }
  }, {
    key: 'render',
    value: function render() {
      var expandedRowIds = this.state.expandedRowIds;


      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'RowDetailState'
        },
        React.createElement(dxReactCore.Getter, { name: 'expandedDetailRowIds', value: expandedRowIds }),
        React.createElement(dxReactCore.Action, { name: 'toggleDetailRowExpanded', action: this.toggleDetailRowExpanded })
      );
    }
  }]);
  return RowDetailState;
}(React.PureComponent);

RowDetailState.propTypes = {
  expandedRowIds: PropTypes.array,
  defaultExpandedRowIds: PropTypes.array,
  onExpandedRowIdsChange: PropTypes.func
};

RowDetailState.defaultProps = {
  expandedRowIds: undefined,
  defaultExpandedRowIds: [],
  onExpandedRowIdsChange: undefined
};

var getCellColSpanComputed = function getCellColSpanComputed(_ref) {
  var getTableCellColSpan = _ref.getTableCellColSpan;
  return dxGridCore.tableDetailCellColSpanGetter(getTableCellColSpan);
};

var pluginDependencies$10 = [{ name: 'RowDetailState' }, { name: 'Table' }];

var TableRowDetail = function (_React$PureComponent) {
  inherits(TableRowDetail, _React$PureComponent);

  function TableRowDetail() {
    classCallCheck(this, TableRowDetail);
    return possibleConstructorReturn(this, (TableRowDetail.__proto__ || Object.getPrototypeOf(TableRowDetail)).apply(this, arguments));
  }

  createClass(TableRowDetail, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          rowHeight = _props.rowHeight,
          Content = _props.contentComponent,
          ToggleCell = _props.toggleCellComponent,
          Cell = _props.cellComponent,
          Row = _props.rowComponent,
          toggleColumnWidth = _props.toggleColumnWidth;


      var tableColumnsComputed = function tableColumnsComputed(_ref2) {
        var tableColumns = _ref2.tableColumns;
        return dxGridCore.tableColumnsWithDetail(tableColumns, toggleColumnWidth);
      };
      var tableBodyRowsComputed = function tableBodyRowsComputed(_ref3) {
        var tableBodyRows = _ref3.tableBodyRows,
            expandedDetailRowIds = _ref3.expandedDetailRowIds;
        return dxGridCore.tableRowsWithExpandedDetail(tableBodyRows, expandedDetailRowIds, rowHeight);
      };

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'TableRowDetail',
          dependencies: pluginDependencies$10
        },
        React.createElement(dxReactCore.Getter, { name: 'tableColumns', computed: tableColumnsComputed }),
        React.createElement(dxReactCore.Getter, { name: 'tableBodyRows', computed: tableBodyRowsComputed }),
        React.createElement(dxReactCore.Getter, { name: 'getTableCellColSpan', computed: getCellColSpanComputed }),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableCell',
            predicate: function predicate(_ref4) {
              var tableRow = _ref4.tableRow,
                  tableColumn = _ref4.tableColumn;
              return dxGridCore.isDetailToggleTableCell(tableRow, tableColumn);
            }
          },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (_ref5, _ref6) {
                var expandedDetailRowIds = _ref5.expandedDetailRowIds;
                var toggleDetailRowExpanded$$1 = _ref6.toggleDetailRowExpanded;
                return React.createElement(ToggleCell, _extends({}, params, {
                  row: params.tableRow.row,
                  expanded: dxGridCore.isDetailRowExpanded(expandedDetailRowIds, params.tableRow.rowId),
                  onToggle: function onToggle() {
                    return toggleDetailRowExpanded$$1({ rowId: params.tableRow.rowId });
                  }
                }));
              }
            );
          }
        ),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableCell',
            predicate: function predicate(_ref7) {
              var tableRow = _ref7.tableRow;
              return dxGridCore.isDetailTableRow(tableRow);
            }
          },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (_ref8) {
                var tableColumns = _ref8.tableColumns;

                if (dxGridCore.isDetailTableCell(params.tableColumn, tableColumns)) {
                  return React.createElement(
                    Cell,
                    _extends({}, params, {
                      row: params.tableRow.row
                    }),
                    React.createElement(Content, { row: params.tableRow.row })
                  );
                }
                return null;
              }
            );
          }
        ),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableRow',
            predicate: function predicate(_ref9) {
              var tableRow = _ref9.tableRow;
              return dxGridCore.isDetailTableRow(tableRow);
            }
          },
          function (params) {
            return React.createElement(Row, _extends({}, params, {
              row: params.tableRow.row
            }));
          }
        )
      );
    }
  }]);
  return TableRowDetail;
}(React.PureComponent);

TableRowDetail.propTypes = {
  contentComponent: PropTypes.func,
  toggleCellComponent: PropTypes.func.isRequired,
  cellComponent: PropTypes.func.isRequired,
  rowComponent: PropTypes.func.isRequired,
  toggleColumnWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number
};

TableRowDetail.defaultProps = {
  contentComponent: function contentComponent() {
    return null;
  },
  rowHeight: undefined
};

var pluginDependencies$11 = [{ name: 'GroupingState' }, { name: 'Table' }, { name: 'DataTypeProvider', optional: true }];

var tableBodyRowsComputed$1 = function tableBodyRowsComputed(_ref) {
  var tableBodyRows = _ref.tableBodyRows,
      isGroupRow = _ref.isGroupRow;
  return dxGridCore.tableRowsWithGrouping(tableBodyRows, isGroupRow);
};
var getCellColSpanComputed$1 = function getCellColSpanComputed(_ref2) {
  var getTableCellColSpan = _ref2.getTableCellColSpan;
  return dxGridCore.tableGroupCellColSpanGetter(getTableCellColSpan);
};

var showColumnWhenGroupedGetter = function showColumnWhenGroupedGetter(showColumnsWhenGrouped) {
  var columnExtensions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var map = columnExtensions.reduce(function (acc, columnExtension) {
    acc[columnExtension.columnName] = columnExtension.showWhenGrouped;
    return acc;
  }, {});

  return function (columnName) {
    return map[columnName] || showColumnsWhenGrouped;
  };
};

var TableGroupRow = function (_React$PureComponent) {
  inherits(TableGroupRow, _React$PureComponent);

  function TableGroupRow() {
    classCallCheck(this, TableGroupRow);
    return possibleConstructorReturn(this, (TableGroupRow.__proto__ || Object.getPrototypeOf(TableGroupRow)).apply(this, arguments));
  }

  createClass(TableGroupRow, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          GroupCell = _props.cellComponent,
          GroupRow = _props.rowComponent,
          GroupIndentCell = _props.indentCellComponent,
          indentColumnWidth = _props.indentColumnWidth,
          showColumnsWhenGrouped = _props.showColumnsWhenGrouped,
          columnExtensions = _props.columnExtensions;


      var tableColumnsComputed = function tableColumnsComputed(_ref3) {
        var columns = _ref3.columns,
            tableColumns = _ref3.tableColumns,
            grouping = _ref3.grouping,
            draftGrouping = _ref3.draftGrouping;
        return dxGridCore.tableColumnsWithGrouping(columns, tableColumns, grouping, draftGrouping, indentColumnWidth, showColumnWhenGroupedGetter(showColumnsWhenGrouped, columnExtensions));
      };

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'TableGroupRow',
          dependencies: pluginDependencies$11
        },
        React.createElement(dxReactCore.Getter, { name: 'tableColumns', computed: tableColumnsComputed }),
        React.createElement(dxReactCore.Getter, { name: 'tableBodyRows', computed: tableBodyRowsComputed$1 }),
        React.createElement(dxReactCore.Getter, { name: 'getTableCellColSpan', computed: getCellColSpanComputed$1 }),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableCell',
            predicate: function predicate(_ref4) {
              var tableRow = _ref4.tableRow;
              return dxGridCore.isGroupTableRow(tableRow);
            }
          },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (_ref5, _ref6) {
                var grouping = _ref5.grouping,
                    expandedGroups = _ref5.expandedGroups;
                var toggleGroupExpanded = _ref6.toggleGroupExpanded;

                if (dxGridCore.isGroupTableCell(params.tableRow, params.tableColumn)) {
                  return React.createElement(
                    dxReactCore.TemplatePlaceholder,
                    {
                      name: 'valueFormatter',
                      params: {
                        column: params.tableColumn.column,
                        value: params.tableRow.row.value
                      }
                    },
                    function (content) {
                      return React.createElement(
                        GroupCell,
                        _extends({}, params, {
                          row: params.tableRow.row,
                          column: params.tableColumn.column,
                          expanded: expandedGroups.indexOf(params.tableRow.row.compoundKey) !== -1,
                          onToggle: function onToggle() {
                            return toggleGroupExpanded({ groupKey: params.tableRow.row.compoundKey });
                          }
                        }),
                        content
                      );
                    }
                  );
                }
                if (dxGridCore.isGroupIndentTableCell(params.tableRow, params.tableColumn, grouping)) {
                  if (GroupIndentCell) {
                    return React.createElement(GroupIndentCell, _extends({}, params, {
                      row: params.tableRow.row,
                      column: params.tableColumn.column
                    }));
                  }
                  return React.createElement(dxReactCore.TemplatePlaceholder, null);
                }
                return null;
              }
            );
          }
        ),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableRow',
            predicate: function predicate(_ref7) {
              var tableRow = _ref7.tableRow;
              return dxGridCore.isGroupTableRow(tableRow);
            }
          },
          function (params) {
            return React.createElement(GroupRow, _extends({}, params, {
              row: params.tableRow.row
            }));
          }
        )
      );
    }
  }]);
  return TableGroupRow;
}(React.PureComponent);

TableGroupRow.propTypes = {
  cellComponent: PropTypes.func.isRequired,
  rowComponent: PropTypes.func.isRequired,
  indentCellComponent: PropTypes.func,
  indentColumnWidth: PropTypes.number.isRequired,
  showColumnsWhenGrouped: PropTypes.bool,
  columnExtensions: PropTypes.array
};

TableGroupRow.defaultProps = {
  indentCellComponent: null,
  showColumnsWhenGrouped: false,
  columnExtensions: undefined
};

var tableHeaderRowsComputed$1 = function tableHeaderRowsComputed(_ref) {
  var tableHeaderRows = _ref.tableHeaderRows;
  return dxGridCore.tableRowsWithHeading(tableHeaderRows);
};

var TableHeaderRow = function (_React$PureComponent) {
  inherits(TableHeaderRow, _React$PureComponent);

  function TableHeaderRow() {
    classCallCheck(this, TableHeaderRow);
    return possibleConstructorReturn(this, (TableHeaderRow.__proto__ || Object.getPrototypeOf(TableHeaderRow)).apply(this, arguments));
  }

  createClass(TableHeaderRow, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          showSortingControls = _props.showSortingControls,
          showGroupingControls = _props.showGroupingControls,
          HeaderCell = _props.cellComponent,
          HeaderRow = _props.rowComponent,
          messages = _props.messages;

      var getMessage = dxGridCore.getMessagesFormatter(messages);

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'TableHeaderRow',
          dependencies: [{ name: 'Table' }, { name: 'SortingState', optional: !showSortingControls }, { name: 'GroupingState', optional: !showGroupingControls }, { name: 'DragDropProvider', optional: true }, { name: 'TableColumnResizing', optional: true }]
        },
        React.createElement(dxReactCore.Getter, { name: 'tableHeaderRows', computed: tableHeaderRowsComputed$1 }),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableCell',
            predicate: function predicate(_ref2) {
              var tableRow = _ref2.tableRow,
                  tableColumn = _ref2.tableColumn;
              return dxGridCore.isHeadingTableCell(tableRow, tableColumn);
            }
          },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (_ref3, _ref4) {
                var sorting = _ref3.sorting,
                    tableColumns = _ref3.tableColumns,
                    draggingEnabled = _ref3.draggingEnabled,
                    tableColumnResizingEnabled = _ref3.tableColumnResizingEnabled,
                    isColumnSortingEnabled = _ref3.isColumnSortingEnabled,
                    isColumnGroupingEnabled = _ref3.isColumnGroupingEnabled;
                var changeColumnSorting$$1 = _ref4.changeColumnSorting,
                    changeColumnGrouping$$1 = _ref4.changeColumnGrouping,
                    changeTableColumnWidth$$1 = _ref4.changeTableColumnWidth,
                    draftTableColumnWidth$$1 = _ref4.draftTableColumnWidth,
                    cancelTableColumnWidthDraft$$1 = _ref4.cancelTableColumnWidthDraft;
                var columnName = params.tableColumn.column.name;

                var atLeastOneDataColumn = tableColumns.filter(function (_ref5) {
                  var type = _ref5.type;
                  return type === dxGridCore.TABLE_DATA_TYPE;
                }).length > 1;
                var sortingEnabled = isColumnSortingEnabled && isColumnSortingEnabled(columnName);
                var groupingEnabled = isColumnGroupingEnabled && isColumnGroupingEnabled(columnName) && atLeastOneDataColumn;

                return React.createElement(HeaderCell, _extends({}, params, {
                  column: params.tableColumn.column,
                  getMessage: getMessage,
                  sortingEnabled: sortingEnabled,
                  groupingEnabled: groupingEnabled,
                  showSortingControls: showSortingControls,
                  showGroupingControls: showGroupingControls,
                  draggingEnabled: draggingEnabled && atLeastOneDataColumn,
                  resizingEnabled: tableColumnResizingEnabled,
                  sortingDirection: showSortingControls && sorting !== undefined ? dxGridCore.getColumnSortingDirection(sorting, columnName) : undefined,
                  onSort: function onSort(_ref6) {
                    var direction = _ref6.direction,
                        keepOther = _ref6.keepOther;
                    return changeColumnSorting$$1({ columnName: columnName, direction: direction, keepOther: keepOther });
                  },
                  onGroup: function onGroup() {
                    return changeColumnGrouping$$1({ columnName: columnName });
                  },
                  onWidthChange: function onWidthChange(_ref7) {
                    var shift = _ref7.shift;
                    return changeTableColumnWidth$$1({ columnName: columnName, shift: shift });
                  },
                  onWidthDraft: function onWidthDraft(_ref8) {
                    var shift = _ref8.shift;
                    return draftTableColumnWidth$$1({ columnName: columnName, shift: shift });
                  },
                  onWidthDraftCancel: function onWidthDraftCancel() {
                    return cancelTableColumnWidthDraft$$1();
                  },
                  before: React.createElement(dxReactCore.TemplatePlaceholder, {
                    name: 'tableHeaderCellBefore',
                    params: {
                      column: params.tableColumn.column
                    }
                  })
                }));
              }
            );
          }
        ),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableRow',
            predicate: function predicate(_ref9) {
              var tableRow = _ref9.tableRow;
              return dxGridCore.isHeadingTableRow(tableRow);
            }
          },
          function (params) {
            return React.createElement(HeaderRow, params);
          }
        )
      );
    }
  }]);
  return TableHeaderRow;
}(React.PureComponent);

TableHeaderRow.propTypes = {
  showSortingControls: PropTypes.bool,
  showGroupingControls: PropTypes.bool,
  cellComponent: PropTypes.func.isRequired,
  rowComponent: PropTypes.func.isRequired,
  messages: PropTypes.object
};

TableHeaderRow.defaultProps = {
  showSortingControls: false,
  showGroupingControls: false,
  messages: null
};

var CellPlaceholder$1 = function CellPlaceholder(props) {
  return React.createElement(dxReactCore.TemplatePlaceholder, { params: props });
};

var TableBandHeader = function (_React$PureComponent) {
  inherits(TableBandHeader, _React$PureComponent);

  function TableBandHeader() {
    classCallCheck(this, TableBandHeader);
    return possibleConstructorReturn(this, (TableBandHeader.__proto__ || Object.getPrototypeOf(TableBandHeader)).apply(this, arguments));
  }

  createClass(TableBandHeader, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          Cell = _props.cellComponent,
          Row = _props.rowComponent,
          HeaderCell = _props.bandedHeaderCellComponent,
          InvisibleCell = _props.invisibleCellComponent,
          columnBands = _props.columnBands;


      var tableHeaderRowsComputed = function tableHeaderRowsComputed(_ref) {
        var tableHeaderRows = _ref.tableHeaderRows,
            tableColumns = _ref.tableColumns;
        return dxGridCore.tableRowsWithBands(tableHeaderRows, columnBands, tableColumns);
      };

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'TableBandHeader',
          dependencies: [{ name: 'Table' }, { name: 'TableHeaderRow' }, { name: 'TableSelection', optional: true }, { name: 'TableEditColumn', optional: true }]
        },
        React.createElement(dxReactCore.Getter, { name: 'tableHeaderRows', computed: tableHeaderRowsComputed }),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableCell',
            predicate: function predicate(_ref2) {
              var tableRow = _ref2.tableRow;
              return dxGridCore.isBandedOrHeaderRow(tableRow);
            }
          },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (_ref3) {
                var tableColumns = _ref3.tableColumns,
                    tableHeaderRows = _ref3.tableHeaderRows;

                var bandComponent = dxGridCore.getBandComponent(params, tableHeaderRows, tableColumns, columnBands);
                switch (bandComponent.type) {
                  case dxGridCore.BAND_DUPLICATE_RENDER:
                    return React.createElement(dxReactCore.TemplatePlaceholder, null);
                  case dxGridCore.BAND_EMPTY_CELL:
                    return React.createElement(InvisibleCell, null);
                  case dxGridCore.BAND_GROUP_CELL:
                    {
                      var _bandComponent$payloa = bandComponent.payload,
                          value = _bandComponent$payloa.value,
                          payload = objectWithoutProperties(_bandComponent$payloa, ['value']);

                      return React.createElement(
                        Cell,
                        _extends({}, params, payload),
                        value
                      );
                    }
                  case dxGridCore.BAND_HEADER_CELL:
                    return React.createElement(dxReactCore.TemplatePlaceholder, {
                      name: 'tableCell',
                      params: _extends({}, params, bandComponent.payload)
                    });
                  default:
                    return null;
                }
              }
            );
          }
        ),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableCell',
            predicate: function predicate(_ref4) {
              var tableRow = _ref4.tableRow,
                  tableColumn = _ref4.tableColumn;
              return dxGridCore.isHeadingTableCell(tableRow, tableColumn);
            }
          },
          function (params) {
            return React.createElement(HeaderCell, _extends({ component: CellPlaceholder$1 }, params));
          }
        ),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableRow',
            predicate: function predicate(_ref5) {
              var tableRow = _ref5.tableRow;
              return dxGridCore.isBandedTableRow(tableRow);
            }
          },
          function (params) {
            return React.createElement(Row, params);
          }
        )
      );
    }
  }]);
  return TableBandHeader;
}(React.PureComponent);

TableBandHeader.propTypes = {
  columnBands: PropTypes.array.isRequired,
  cellComponent: PropTypes.func.isRequired,
  rowComponent: PropTypes.func.isRequired,
  bandedHeaderCellComponent: PropTypes.func.isRequired,
  invisibleCellComponent: PropTypes.func.isRequired
};

var pluginDependencies$12 = [{ name: 'FilteringState' }, { name: 'Table' }, { name: 'DataTypeProvider', optional: true }];

var TableFilterRow = function (_React$PureComponent) {
  inherits(TableFilterRow, _React$PureComponent);

  function TableFilterRow(props) {
    classCallCheck(this, TableFilterRow);

    var _this = possibleConstructorReturn(this, (TableFilterRow.__proto__ || Object.getPrototypeOf(TableFilterRow)).call(this, props));

    _this.state = {
      filterOperations: {}
    };
    return _this;
  }

  createClass(TableFilterRow, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          rowHeight = _props.rowHeight,
          showFilterSelector = _props.showFilterSelector,
          FilterCell = _props.cellComponent,
          FilterRow = _props.rowComponent,
          FilterSelector = _props.filterSelectorComponent,
          iconComponent = _props.iconComponent,
          EditorComponent = _props.editorComponent,
          messages = _props.messages;


      var getMessage = dxGridCore.getMessagesFormatter(messages);

      var tableHeaderRowsComputed = function tableHeaderRowsComputed(_ref) {
        var tableHeaderRows = _ref.tableHeaderRows;
        return dxGridCore.tableHeaderRowsWithFilter(tableHeaderRows, rowHeight);
      };

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'TableFilterRow',
          dependencies: pluginDependencies$12
        },
        React.createElement(dxReactCore.Getter, { name: 'tableHeaderRows', computed: tableHeaderRowsComputed }),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableCell',
            predicate: function predicate(_ref2) {
              var tableRow = _ref2.tableRow,
                  tableColumn = _ref2.tableColumn;
              return dxGridCore.isFilterTableCell(tableRow, tableColumn);
            }
          },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (_ref3, _ref4) {
                var filters = _ref3.filters,
                    isColumnFilteringEnabled = _ref3.isColumnFilteringEnabled,
                    getAvailableFilterOperations = _ref3.getAvailableFilterOperations;
                var changeColumnFilter$$1 = _ref4.changeColumnFilter;
                var columnName = params.tableColumn.column.name;

                var filter = dxGridCore.getColumnFilterConfig(filters, columnName);
                var onFilter = function onFilter(config) {
                  return changeColumnFilter$$1({ columnName: columnName, config: config });
                };
                var columnFilterOperations = dxGridCore.getColumnFilterOperations(getAvailableFilterOperations, columnName);
                var selectedFilterOperation = _this2.state.filterOperations[columnName] || columnFilterOperations[0];
                var handleFilterOperationChange = function handleFilterOperationChange(value) {
                  _this2.setState({
                    filterOperations: _extends({}, _this2.state.filterOperations, defineProperty({}, columnName, value))
                  });
                  if (filter && !dxGridCore.isFilterValueEmpty(filter.value)) {
                    onFilter({ value: filter.value, operation: value });
                  }
                };
                var handleFilterValueChange = function handleFilterValueChange(value) {
                  return onFilter(!dxGridCore.isFilterValueEmpty(value) ? { value: value, operation: selectedFilterOperation } : null);
                };
                var filteringEnabled = isColumnFilteringEnabled(columnName);
                return React.createElement(
                  dxReactCore.TemplatePlaceholder,
                  {
                    name: 'valueEditor',
                    params: {
                      column: params.tableColumn.column,
                      value: filter ? filter.value : undefined,
                      onValueChange: handleFilterValueChange
                    }
                  },
                  function (content) {
                    return React.createElement(
                      FilterCell,
                      _extends({}, params, {
                        getMessage: getMessage,
                        column: params.tableColumn.column,
                        filter: filter,
                        filteringEnabled: filteringEnabled,
                        onFilter: onFilter
                      }),
                      showFilterSelector ? React.createElement(FilterSelector, {
                        iconComponent: iconComponent,
                        value: selectedFilterOperation,
                        availableValues: columnFilterOperations,
                        onChange: handleFilterOperationChange,
                        disabled: !filteringEnabled,
                        getMessage: getMessage
                      }) : null,
                      content || React.createElement(EditorComponent, {
                        value: filter ? filter.value : '',
                        disabled: !filteringEnabled,
                        getMessage: getMessage,
                        onChange: handleFilterValueChange
                      })
                    );
                  }
                );
              }
            );
          }
        ),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableRow',
            predicate: function predicate(_ref5) {
              var tableRow = _ref5.tableRow;
              return dxGridCore.isFilterTableRow(tableRow);
            }
          },
          function (params) {
            return React.createElement(FilterRow, params);
          }
        )
      );
    }
  }]);
  return TableFilterRow;
}(React.PureComponent);

TableFilterRow.propTypes = {
  rowHeight: PropTypes.any,
  showFilterSelector: PropTypes.bool,
  messages: PropTypes.object,
  cellComponent: PropTypes.func.isRequired,
  rowComponent: PropTypes.func.isRequired,
  filterSelectorComponent: PropTypes.func.isRequired,
  iconComponent: PropTypes.func.isRequired,
  editorComponent: PropTypes.func.isRequired
};

TableFilterRow.defaultProps = {
  rowHeight: undefined,
  showFilterSelector: false,
  messages: {}
};

var pluginDependencies$13 = [{ name: 'EditingState' }, { name: 'Table' }, { name: 'DataTypeProvider', optional: true }];

var TableEditRow = function (_React$PureComponent) {
  inherits(TableEditRow, _React$PureComponent);

  function TableEditRow() {
    classCallCheck(this, TableEditRow);
    return possibleConstructorReturn(this, (TableEditRow.__proto__ || Object.getPrototypeOf(TableEditRow)).apply(this, arguments));
  }

  createClass(TableEditRow, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          EditCell = _props.cellComponent,
          EditRow = _props.rowComponent,
          rowHeight = _props.rowHeight;


      var tableBodyRowsComputed = function tableBodyRowsComputed(_ref) {
        var tableBodyRows = _ref.tableBodyRows,
            editingRowIds = _ref.editingRowIds,
            addedRows = _ref.addedRows;
        return dxGridCore.tableRowsWithEditing(tableBodyRows, editingRowIds, addedRows, rowHeight);
      };

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'TableEditRow',
          dependencies: pluginDependencies$13
        },
        React.createElement(dxReactCore.Getter, { name: 'tableBodyRows', computed: tableBodyRowsComputed }),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableCell',
            predicate: function predicate(_ref2) {
              var tableRow = _ref2.tableRow,
                  tableColumn = _ref2.tableColumn;
              return dxGridCore.isEditTableCell(tableRow, tableColumn);
            }
          },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (_ref3, _ref4) {
                var getCellValue = _ref3.getCellValue,
                    createRowChange = _ref3.createRowChange,
                    rowChanges = _ref3.rowChanges,
                    isColumnEditingEnabled = _ref3.isColumnEditingEnabled;
                var changeAddedRow$$1 = _ref4.changeAddedRow,
                    changeRow$$1 = _ref4.changeRow;
                var _params$tableRow = params.tableRow,
                    rowId = _params$tableRow.rowId,
                    row = _params$tableRow.row;
                var column = params.tableColumn.column;
                var columnName = column.name;


                var isNew = dxGridCore.isAddedTableRow(params.tableRow);
                var changedRow = isNew ? row : _extends({}, row, dxGridCore.getRowChange(rowChanges, rowId));

                var value = getCellValue(changedRow, columnName);
                var onValueChange = function onValueChange(newValue) {
                  var changeArgs = {
                    rowId: rowId,
                    change: createRowChange(changedRow, newValue, columnName)
                  };
                  if (isNew) {
                    changeAddedRow$$1(changeArgs);
                  } else {
                    changeRow$$1(changeArgs);
                  }
                };
                return React.createElement(
                  dxReactCore.TemplatePlaceholder,
                  {
                    name: 'valueEditor',
                    params: {
                      column: column,
                      row: row,
                      value: value,
                      onValueChange: onValueChange
                    }
                  },
                  function (content) {
                    return React.createElement(
                      EditCell,
                      _extends({}, params, {
                        row: row,
                        column: column,
                        value: value,
                        editingEnabled: isColumnEditingEnabled(columnName),
                        onValueChange: onValueChange
                      }),
                      content
                    );
                  }
                );
              }
            );
          }
        ),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableRow',
            predicate: function predicate(_ref5) {
              var tableRow = _ref5.tableRow;
              return dxGridCore.isEditTableRow(tableRow) || dxGridCore.isAddedTableRow(tableRow);
            }
          },
          function (params) {
            return React.createElement(EditRow, _extends({}, params, {
              row: params.tableRow.row
            }));
          }
        )
      );
    }
  }]);
  return TableEditRow;
}(React.PureComponent);

TableEditRow.propTypes = {
  rowHeight: PropTypes.any,
  cellComponent: PropTypes.func.isRequired,
  rowComponent: PropTypes.func.isRequired
};

TableEditRow.defaultProps = {
  rowHeight: undefined
};

var pluginDependencies$14 = [{ name: 'EditingState' }, { name: 'Table' }];

var TableEditColumn = function (_React$PureComponent) {
  inherits(TableEditColumn, _React$PureComponent);

  function TableEditColumn() {
    classCallCheck(this, TableEditColumn);
    return possibleConstructorReturn(this, (TableEditColumn.__proto__ || Object.getPrototypeOf(TableEditColumn)).apply(this, arguments));
  }

  createClass(TableEditColumn, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          Cell = _props.cellComponent,
          HeaderCell = _props.headerCellComponent,
          Command = _props.commandComponent,
          showAddCommand = _props.showAddCommand,
          showEditCommand = _props.showEditCommand,
          showDeleteCommand = _props.showDeleteCommand,
          width = _props.width,
          messages = _props.messages;

      var getMessage = dxGridCore.getMessagesFormatter(messages);
      var tableColumnsComputed = function tableColumnsComputed(_ref) {
        var tableColumns = _ref.tableColumns;
        return dxGridCore.tableColumnsWithEditing(tableColumns, width);
      };

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'TableEditColumn',
          dependencies: pluginDependencies$14
        },
        React.createElement(dxReactCore.Getter, { name: 'tableColumns', computed: tableColumnsComputed }),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableCell',
            predicate: function predicate(_ref2) {
              var tableRow = _ref2.tableRow,
                  tableColumn = _ref2.tableColumn;
              return dxGridCore.isHeadingEditCommandsTableCell(tableRow, tableColumn);
            }
          },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (getters, actions) {
                return React.createElement(
                  HeaderCell,
                  params,
                  showAddCommand && React.createElement(Command, {
                    id: 'add',
                    text: getMessage('addCommand'),
                    onExecute: function onExecute() {
                      return actions.addRow();
                    }
                  })
                );
              }
            );
          }
        ),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableCell',
            predicate: function predicate(_ref3) {
              var tableRow = _ref3.tableRow,
                  tableColumn = _ref3.tableColumn;
              return dxGridCore.isEditCommandsTableCell(tableRow, tableColumn);
            }
          },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (getters, actions) {
                var isEdit = dxGridCore.isEditTableRow(params.tableRow);
                var isNew = dxGridCore.isAddedTableRow(params.tableRow);
                var isEditing = isEdit || isNew;
                var rowIds = [params.tableRow.rowId];
                return React.createElement(
                  Cell,
                  _extends({}, params, {
                    row: params.tableRow.row
                  }),
                  showEditCommand && !isEditing && React.createElement(Command, {
                    id: 'edit',
                    text: getMessage('editCommand'),
                    onExecute: function onExecute() {
                      return actions.startEditRows({ rowIds: rowIds });
                    }
                  }),
                  showDeleteCommand && !isEditing && React.createElement(Command, {
                    id: 'delete',
                    text: getMessage('deleteCommand'),
                    onExecute: function onExecute() {
                      actions.deleteRows({ rowIds: rowIds });
                      actions.commitDeletedRows({ rowIds: rowIds });
                    }
                  }),
                  isEditing && React.createElement(Command, {
                    id: 'commit',
                    text: getMessage('commitCommand'),
                    onExecute: function onExecute() {
                      if (isNew) {
                        actions.commitAddedRows({ rowIds: rowIds });
                      } else {
                        actions.stopEditRows({ rowIds: rowIds });
                        actions.commitChangedRows({ rowIds: rowIds });
                      }
                    }
                  }),
                  isEditing && React.createElement(Command, {
                    id: 'cancel',
                    text: getMessage('cancelCommand'),
                    onExecute: function onExecute() {
                      if (isNew) {
                        actions.cancelAddedRows({ rowIds: rowIds });
                      } else {
                        actions.stopEditRows({ rowIds: rowIds });
                        actions.cancelChangedRows({ rowIds: rowIds });
                      }
                    }
                  })
                );
              }
            );
          }
        )
      );
    }
  }]);
  return TableEditColumn;
}(React.PureComponent);
TableEditColumn.propTypes = {
  cellComponent: PropTypes.func.isRequired,
  headerCellComponent: PropTypes.func.isRequired,
  commandComponent: PropTypes.func.isRequired,
  showAddCommand: PropTypes.bool,
  showEditCommand: PropTypes.bool,
  showDeleteCommand: PropTypes.bool,
  width: PropTypes.number,
  messages: PropTypes.object
};
TableEditColumn.defaultProps = {
  showAddCommand: false,
  showEditCommand: false,
  showDeleteCommand: false,
  width: 140,
  messages: {}
};

var pluginDependencies$15 = [{ name: 'Table' }];

var TableColumnResizing = function (_React$PureComponent) {
  inherits(TableColumnResizing, _React$PureComponent);

  function TableColumnResizing(props) {
    classCallCheck(this, TableColumnResizing);

    var _this = possibleConstructorReturn(this, (TableColumnResizing.__proto__ || Object.getPrototypeOf(TableColumnResizing)).call(this, props));

    _this.state = {
      columnWidths: props.columnWidths || props.defaultColumnWidths,
      draftColumnWidths: []
    };

    var stateHelper = dxReactCore.createStateHelper(_this, {
      columnWidths: function columnWidths() {
        return _this.props.onColumnWidthsChange;
      }
    });

    _this.tableColumnsComputed = dxCore.memoize(function (columnWidths) {
      return function (_ref) {
        var tableColumns = _ref.tableColumns;
        return dxGridCore.tableColumnsWithWidths(tableColumns, columnWidths);
      };
    });
    _this.tableColumnsDraftComputed = dxCore.memoize(function (draftColumnWidths) {
      return function (_ref2) {
        var tableColumns = _ref2.tableColumns;
        return dxGridCore.tableColumnsWithDraftWidths(tableColumns, draftColumnWidths);
      };
    });

    _this.changeTableColumnWidth = stateHelper.applyReducer.bind(stateHelper, function (prevState, payload) {
      return dxGridCore.changeTableColumnWidth(prevState, _extends({}, payload, { minColumnWidth: _this.props.minColumnWidth }));
    });
    _this.draftTableColumnWidth = stateHelper.applyReducer.bind(stateHelper, function (prevState, payload) {
      return dxGridCore.draftTableColumnWidth(prevState, _extends({}, payload, { minColumnWidth: _this.props.minColumnWidth }));
    });
    _this.cancelTableColumnWidthDraft = stateHelper.applyReducer.bind(stateHelper, dxGridCore.cancelTableColumnWidthDraft);
    return _this;
  }

  createClass(TableColumnResizing, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var columnWidths = nextProps.columnWidths;

      this.setState(_extends({}, columnWidths !== undefined ? { columnWidths: columnWidths } : null));
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          columnWidths = _state.columnWidths,
          draftColumnWidths = _state.draftColumnWidths;


      var tableColumnsComputed = this.tableColumnsComputed(columnWidths);
      var tableColumnsDraftComputed = this.tableColumnsDraftComputed(draftColumnWidths);

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'TableColumnResizing',
          dependencies: pluginDependencies$15
        },
        React.createElement(dxReactCore.Getter, { name: 'tableColumnResizingEnabled', value: true }),
        React.createElement(dxReactCore.Getter, { name: 'tableColumns', computed: tableColumnsComputed }),
        React.createElement(dxReactCore.Getter, { name: 'tableColumns', computed: tableColumnsDraftComputed }),
        React.createElement(dxReactCore.Action, { name: 'changeTableColumnWidth', action: this.changeTableColumnWidth }),
        React.createElement(dxReactCore.Action, { name: 'draftTableColumnWidth', action: this.draftTableColumnWidth }),
        React.createElement(dxReactCore.Action, { name: 'cancelTableColumnWidthDraft', action: this.cancelTableColumnWidthDraft })
      );
    }
  }]);
  return TableColumnResizing;
}(React.PureComponent);

TableColumnResizing.propTypes = {
  defaultColumnWidths: PropTypes.array,
  columnWidths: PropTypes.array,
  onColumnWidthsChange: PropTypes.func,
  minColumnWidth: PropTypes.number.isRequired
};

TableColumnResizing.defaultProps = {
  defaultColumnWidths: [],
  columnWidths: undefined,
  onColumnWidthsChange: undefined
};

var pluginDependencies$16 = [{ name: 'PagingState' }];

var PagingPanel = function (_React$PureComponent) {
  inherits(PagingPanel, _React$PureComponent);

  function PagingPanel() {
    classCallCheck(this, PagingPanel);
    return possibleConstructorReturn(this, (PagingPanel.__proto__ || Object.getPrototypeOf(PagingPanel)).apply(this, arguments));
  }

  createClass(PagingPanel, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          Pager = _props.containerComponent,
          pageSizes = _props.pageSizes,
          messages = _props.messages;

      var getMessage = dxGridCore.getMessagesFormatter(messages);

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'PagingPanel',
          dependencies: pluginDependencies$16
        },
        React.createElement(
          dxReactCore.Template,
          { name: 'footer' },
          React.createElement(dxReactCore.TemplatePlaceholder, null),
          React.createElement(
            dxReactCore.TemplateConnector,
            null,
            function (_ref, _ref2) {
              var currentPage$$1 = _ref.currentPage,
                  pageSize = _ref.pageSize,
                  totalCount = _ref.totalCount;
              var setCurrentPage$$1 = _ref2.setCurrentPage,
                  setPageSize$$1 = _ref2.setPageSize;
              return React.createElement(Pager, {
                currentPage: currentPage$$1,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPages: dxGridCore.pageCount(totalCount, pageSize),
                pageSizes: pageSizes,
                getMessage: getMessage,
                onCurrentPageChange: setCurrentPage$$1,
                onPageSizeChange: setPageSize$$1
              });
            }
          )
        )
      );
    }
  }]);
  return PagingPanel;
}(React.PureComponent);

PagingPanel.propTypes = {
  pageSizes: PropTypes.arrayOf(PropTypes.number),
  containerComponent: PropTypes.func.isRequired,
  messages: PropTypes.object
};

PagingPanel.defaultProps = {
  pageSizes: [],
  messages: {}
};

var GroupingPanel = function (_React$PureComponent) {
  inherits(GroupingPanel, _React$PureComponent);

  function GroupingPanel() {
    classCallCheck(this, GroupingPanel);
    return possibleConstructorReturn(this, (GroupingPanel.__proto__ || Object.getPrototypeOf(GroupingPanel)).apply(this, arguments));
  }

  createClass(GroupingPanel, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          Layout = _props.layoutComponent,
          Container = _props.containerComponent,
          Item = _props.itemComponent,
          EmptyMessage = _props.emptyMessageComponent,
          showSortingControls = _props.showSortingControls,
          showGroupingControls = _props.showGroupingControls,
          messages = _props.messages;


      var getMessage = dxGridCore.getMessagesFormatter(messages);

      var EmptyMessagePlaceholder = function EmptyMessagePlaceholder() {
        return React.createElement(EmptyMessage, {
          getMessage: getMessage
        });
      };

      var ItemPlaceholder = function ItemPlaceholder(_ref) {
        var item = _ref.item;
        var columnName = item.column.name;


        return React.createElement(
          dxReactCore.TemplateConnector,
          null,
          function (_ref2, _ref3) {
            var sorting = _ref2.sorting,
                isColumnSortingEnabled = _ref2.isColumnSortingEnabled,
                isColumnGroupingEnabled = _ref2.isColumnGroupingEnabled;
            var changeColumnGrouping$$1 = _ref3.changeColumnGrouping,
                changeColumnSorting$$1 = _ref3.changeColumnSorting;

            var sortingEnabled = isColumnSortingEnabled && isColumnSortingEnabled(columnName);
            var groupingEnabled = isColumnGroupingEnabled && isColumnGroupingEnabled(columnName);

            return React.createElement(Item, {
              item: item,
              sortingEnabled: sortingEnabled,
              groupingEnabled: groupingEnabled,
              showSortingControls: showSortingControls,
              sortingDirection: showSortingControls ? dxGridCore.getColumnSortingDirection(sorting, columnName) : undefined,
              showGroupingControls: showGroupingControls,
              onGroup: function onGroup() {
                return changeColumnGrouping$$1({ columnName: columnName });
              },
              onSort: function onSort(_ref4) {
                var direction = _ref4.direction,
                    keepOther = _ref4.keepOther;
                return changeColumnSorting$$1({ columnName: columnName, direction: direction, keepOther: keepOther });
              }
            });
          }
        );
      };

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'GroupingPanel',
          dependencies: [{ name: 'GroupingState' }, { name: 'Toolbar' }, { name: 'SortingState', optional: !showSortingControls }]
        },
        React.createElement(
          dxReactCore.Template,
          { name: 'toolbarContent' },
          React.createElement(
            dxReactCore.TemplateConnector,
            null,
            function (_ref5, _ref6) {
              var columns = _ref5.columns,
                  grouping = _ref5.grouping,
                  draftGrouping = _ref5.draftGrouping,
                  draggingEnabled = _ref5.draggingEnabled,
                  isColumnGroupingEnabled = _ref5.isColumnGroupingEnabled;
              var changeColumnGrouping$$1 = _ref6.changeColumnGrouping,
                  draftColumnGrouping$$1 = _ref6.draftColumnGrouping,
                  cancelColumnGroupingDraft$$1 = _ref6.cancelColumnGroupingDraft;
              return React.createElement(Layout, {
                items: dxGridCore.groupingPanelItems(columns, grouping, draftGrouping),
                isColumnGroupingEnabled: isColumnGroupingEnabled,
                draggingEnabled: draggingEnabled,
                onGroup: changeColumnGrouping$$1,
                onGroupDraft: draftColumnGrouping$$1,
                onGroupDraftCancel: cancelColumnGroupingDraft$$1,
                itemComponent: ItemPlaceholder,
                emptyMessageComponent: EmptyMessagePlaceholder,
                containerComponent: Container
              });
            }
          ),
          React.createElement(dxReactCore.TemplatePlaceholder, null)
        )
      );
    }
  }]);
  return GroupingPanel;
}(React.PureComponent);

GroupingPanel.propTypes = {
  showSortingControls: PropTypes.bool,
  showGroupingControls: PropTypes.bool,
  layoutComponent: PropTypes.func.isRequired,
  containerComponent: PropTypes.func.isRequired,
  itemComponent: PropTypes.func.isRequired,
  emptyMessageComponent: PropTypes.func.isRequired,
  messages: PropTypes.object
};

GroupingPanel.defaultProps = {
  showSortingControls: false,
  showGroupingControls: false,
  messages: {}
};

// eslint-disable-next-line react/prefer-stateless-function
var DataTypeProvider = function (_React$PureComponent) {
  inherits(DataTypeProvider, _React$PureComponent);

  function DataTypeProvider() {
    classCallCheck(this, DataTypeProvider);
    return possibleConstructorReturn(this, (DataTypeProvider.__proto__ || Object.getPrototypeOf(DataTypeProvider)).apply(this, arguments));
  }

  createClass(DataTypeProvider, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          columnNames = _props.for,
          Formatter = _props.formatterComponent,
          Editor = _props.editorComponent,
          availableFilterOperations = _props.availableFilterOperations;


      var getAvailableFilterOperationsComputed = function getAvailableFilterOperationsComputed(_ref) {
        var getAvailableFilterOperations = _ref.getAvailableFilterOperations;
        return dxGridCore.getAvailableFilterOperationsGetter(getAvailableFilterOperations, availableFilterOperations, columnNames);
      };

      return React.createElement(
        dxReactCore.Plugin,
        { name: 'DataTypeProvider' },
        React.createElement(dxReactCore.Getter, { name: 'getAvailableFilterOperations', computed: getAvailableFilterOperationsComputed }),
        Formatter ? React.createElement(
          dxReactCore.Template,
          {
            name: 'valueFormatter',
            predicate: function predicate(_ref2) {
              var column = _ref2.column;
              return columnNames.includes(column.name);
            }
          },
          function (params) {
            return React.createElement(Formatter, params);
          }
        ) : null,
        Editor ? React.createElement(
          dxReactCore.Template,
          {
            name: 'valueEditor',
            predicate: function predicate(_ref3) {
              var column = _ref3.column;
              return columnNames.includes(column.name);
            }
          },
          function (params) {
            return React.createElement(Editor, params);
          }
        ) : null
      );
    }
  }]);
  return DataTypeProvider;
}(React.PureComponent);

DataTypeProvider.propTypes = {
  for: PropTypes.arrayOf(PropTypes.string).isRequired,
  formatterComponent: PropTypes.func,
  editorComponent: PropTypes.func,
  availableFilterOperations: PropTypes.arrayOf(PropTypes.string)
};

DataTypeProvider.defaultProps = {
  formatterComponent: undefined,
  editorComponent: undefined,
  availableFilterOperations: undefined
};

var pluginDependencies$17 = [{ name: 'Table' }];

var visibleTableColumnsComputed = function visibleTableColumnsComputed(_ref) {
  var tableColumns = _ref.tableColumns,
      hiddenColumnNames = _ref.hiddenColumnNames;
  return dxGridCore.visibleTableColumns(tableColumns, hiddenColumnNames);
};

var columnExtensionValueGetter$4 = function columnExtensionValueGetter(columnExtensions, defaultValue) {
  return dxGridCore.getColumnExtensionValueGetter(columnExtensions, 'togglingEnabled', defaultValue);
};

var TableColumnVisibility = function (_React$PureComponent) {
  inherits(TableColumnVisibility, _React$PureComponent);

  function TableColumnVisibility(props) {
    classCallCheck(this, TableColumnVisibility);

    var _this = possibleConstructorReturn(this, (TableColumnVisibility.__proto__ || Object.getPrototypeOf(TableColumnVisibility)).call(this, props));

    _this.state = {
      hiddenColumnNames: props.hiddenColumnNames || props.defaultHiddenColumnNames
    };
    var stateHelper = dxReactCore.createStateHelper(_this, {
      hiddenColumnNames: function hiddenColumnNames() {
        return _this.props.onHiddenColumnNamesChange;
      }
    });

    _this.toggleColumnVisibility = stateHelper.applyFieldReducer.bind(stateHelper, 'hiddenColumnNames', dxGridCore.toggleColumn);
    return _this;
  }

  createClass(TableColumnVisibility, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var hiddenColumnNames = nextProps.hiddenColumnNames;

      this.setState(_extends({}, hiddenColumnNames !== undefined ? { hiddenColumnNames: hiddenColumnNames } : null));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          EmptyMessage = _props.emptyMessageComponent,
          messages = _props.messages;

      var getMessage = dxGridCore.getMessagesFormatter(messages);
      var hiddenColumnNames = this.state.hiddenColumnNames;
      var _props2 = this.props,
          columnExtensions = _props2.columnExtensions,
          columnTogglingEnabled = _props2.columnTogglingEnabled;


      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'TableColumnVisibility',
          dependencies: pluginDependencies$17
        },
        React.createElement(dxReactCore.Getter, { name: 'hiddenColumnNames', value: hiddenColumnNames }),
        React.createElement(dxReactCore.Getter, { name: 'tableColumns', computed: visibleTableColumnsComputed }),
        React.createElement(dxReactCore.Getter, {
          name: 'isColumnTogglingEnabled',
          value: columnExtensionValueGetter$4(columnExtensions, columnTogglingEnabled)
        }),
        React.createElement(dxReactCore.Action, {
          name: 'toggleColumnVisibility',
          action: this.toggleColumnVisibility
        }),
        React.createElement(
          dxReactCore.Template,
          { name: 'table' },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (_ref2) {
                var tableColumns = _ref2.tableColumns;
                return dxGridCore.tableDataColumnsExist(tableColumns) ? React.createElement(dxReactCore.TemplatePlaceholder, null) : React.createElement(EmptyMessage, _extends({
                  getMessage: getMessage
                }, params));
              }
            );
          }
        )
      );
    }
  }]);
  return TableColumnVisibility;
}(React.PureComponent);

TableColumnVisibility.propTypes = {
  hiddenColumnNames: PropTypes.arrayOf(PropTypes.string),
  defaultHiddenColumnNames: PropTypes.arrayOf(PropTypes.string),
  emptyMessageComponent: PropTypes.func.isRequired,
  onHiddenColumnNamesChange: PropTypes.func,
  messages: PropTypes.object,
  columnExtensions: PropTypes.array,
  columnTogglingEnabled: PropTypes.bool
};

TableColumnVisibility.defaultProps = {
  hiddenColumnNames: undefined,
  defaultHiddenColumnNames: [],
  onHiddenColumnNamesChange: undefined,
  messages: {},
  columnExtensions: undefined,
  columnTogglingEnabled: true
};

var Toolbar = function (_React$PureComponent) {
  inherits(Toolbar, _React$PureComponent);

  function Toolbar() {
    classCallCheck(this, Toolbar);
    return possibleConstructorReturn(this, (Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).apply(this, arguments));
  }

  createClass(Toolbar, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          Root = _props.rootComponent,
          FlexibleSpaceComponent = _props.flexibleSpaceComponent;

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'Toolbar'
        },
        React.createElement(
          dxReactCore.Template,
          { name: 'header' },
          React.createElement(
            Root,
            null,
            React.createElement(dxReactCore.TemplatePlaceholder, { name: 'toolbarContent' })
          ),
          React.createElement(dxReactCore.TemplatePlaceholder, null)
        ),
        React.createElement(
          dxReactCore.Template,
          { name: 'toolbarContent' },
          React.createElement(FlexibleSpaceComponent, null)
        )
      );
    }
  }]);
  return Toolbar;
}(React.PureComponent);

Toolbar.propTypes = {
  rootComponent: PropTypes.func.isRequired,
  flexibleSpaceComponent: PropTypes.func.isRequired
};

var TreeDataState = function (_React$PureComponent) {
  inherits(TreeDataState, _React$PureComponent);

  function TreeDataState(props) {
    classCallCheck(this, TreeDataState);

    var _this = possibleConstructorReturn(this, (TreeDataState.__proto__ || Object.getPrototypeOf(TreeDataState)).call(this, props));

    _this.state = {
      expandedRowIds: props.expandedRowIds || props.defaultExpandedRowIds
    };

    var stateHelper = dxReactCore.createStateHelper(_this, {
      expandedRowIds: function expandedRowIds() {
        return _this.props.onExpandedRowIdsChange;
      }
    });

    _this.toggleRowExpanded = stateHelper.applyFieldReducer.bind(stateHelper, 'expandedRowIds', dxGridCore.toggleRowExpanded);
    return _this;
  }

  createClass(TreeDataState, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var expandedRowIds = nextProps.expandedRowIds;

      this.setState(_extends({}, expandedRowIds !== undefined ? { expandedRowIds: expandedRowIds } : null));
    }
  }, {
    key: 'render',
    value: function render() {
      var expandedRowIds = this.state.expandedRowIds;


      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'TreeDataState'
        },
        React.createElement(dxReactCore.Getter, { name: 'expandedRowIds', value: expandedRowIds }),
        ' ',
        React.createElement(dxReactCore.Action, { name: 'toggleRowExpanded', action: this.toggleRowExpanded })
      );
    }
  }]);
  return TreeDataState;
}(React.PureComponent);

TreeDataState.propTypes = {
  expandedRowIds: PropTypes.array,
  defaultExpandedRowIds: PropTypes.array,
  onExpandedRowIdsChange: PropTypes.func
};

TreeDataState.defaultProps = {
  expandedRowIds: undefined,
  defaultExpandedRowIds: [],
  onExpandedRowIdsChange: undefined
};

var pluginDependencies$18 = [{ name: 'TreeDataState' }];

var expandedTreeRowsComputed = function expandedTreeRowsComputed(_ref) {
  var rows = _ref.rows,
      getRowId = _ref.getRowId,
      expandedRowIds = _ref.expandedRowIds;
  return dxGridCore.expandedTreeRows(rows, getRowId, expandedRowIds);
};
var getRowIdComputed$1 = function getRowIdComputed(_ref2) {
  var getRowId = _ref2.getRowId,
      rows = _ref2.rows;
  return dxGridCore.customTreeRowIdGetter(getRowId, rows);
};
var getRowLevelKeyComputed = function getRowLevelKeyComputed(_ref3) {
  var getRowLevelKey = _ref3.getRowLevelKey,
      rows = _ref3.rows;
  return dxGridCore.customTreeRowLevelKeyGetter(getRowLevelKey, rows);
};
var isTreeRowLeafComputed = function isTreeRowLeafComputed(_ref4) {
  var rows = _ref4.rows;
  return dxGridCore.isTreeRowLeafGetter(rows);
};
var getTreeRowLevelComputed = function getTreeRowLevelComputed(_ref5) {
  var rows = _ref5.rows;
  return dxGridCore.getTreeRowLevelGetter(rows);
};
var collapsedTreeRowsGetterComputed = function collapsedTreeRowsGetterComputed(_ref6) {
  var rows = _ref6.rows,
      getCollapsedRows = _ref6.getCollapsedRows;
  return dxGridCore.collapsedTreeRowsGetter(getCollapsedRows, rows);
};
var unwrappedTreeRowsComputed = function unwrappedTreeRowsComputed(_ref7) {
  var rows = _ref7.rows;
  return dxGridCore.unwrappedCustomTreeRows(rows);
};

var CustomTreeData = function (_React$PureComponent) {
  inherits(CustomTreeData, _React$PureComponent);

  function CustomTreeData() {
    classCallCheck(this, CustomTreeData);
    return possibleConstructorReturn(this, (CustomTreeData.__proto__ || Object.getPrototypeOf(CustomTreeData)).apply(this, arguments));
  }

  createClass(CustomTreeData, [{
    key: 'render',
    value: function render() {
      var getChildRows = this.props.getChildRows;

      var treeRowsComputed = function treeRowsComputed(_ref8) {
        var rows = _ref8.rows;
        return dxGridCore.customTreeRowsWithMeta(rows, getChildRows);
      };

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'CustomTreeData',
          dependencies: pluginDependencies$18
        },
        React.createElement(dxReactCore.Getter, { name: 'rows', computed: treeRowsComputed }),
        React.createElement(dxReactCore.Getter, { name: 'getRowId', computed: getRowIdComputed$1 }),
        React.createElement(dxReactCore.Getter, { name: 'getRowLevelKey', computed: getRowLevelKeyComputed }),
        React.createElement(dxReactCore.Getter, { name: 'isTreeRowLeaf', computed: isTreeRowLeafComputed }),
        React.createElement(dxReactCore.Getter, { name: 'getTreeRowLevel', computed: getTreeRowLevelComputed }),
        React.createElement(dxReactCore.Getter, { name: 'rows', computed: expandedTreeRowsComputed }),
        React.createElement(dxReactCore.Getter, { name: 'getCollapsedRows', computed: collapsedTreeRowsGetterComputed }),
        React.createElement(dxReactCore.Getter, { name: 'rows', computed: unwrappedTreeRowsComputed })
      );
    }
  }]);
  return CustomTreeData;
}(React.PureComponent);

CustomTreeData.propTypes = {
  getChildRows: PropTypes.func.isRequired
};

var TableTreeColumn = function (_React$PureComponent) {
  inherits(TableTreeColumn, _React$PureComponent);

  function TableTreeColumn() {
    classCallCheck(this, TableTreeColumn);
    return possibleConstructorReturn(this, (TableTreeColumn.__proto__ || Object.getPrototypeOf(TableTreeColumn)).apply(this, arguments));
  }

  createClass(TableTreeColumn, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          forColumnName = _props.for,
          showSelectionControls = _props.showSelectionControls,
          showSelectAll = _props.showSelectAll,
          Indent = _props.indentComponent,
          ExpandButton = _props.expandButtonComponent,
          Checkbox = _props.checkboxComponent,
          Content = _props.contentComponent,
          Cell = _props.cellComponent;

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'TableTreeColumn',
          dependencies: [{ name: 'DataTypeProvider', optional: true }, { name: 'TreeDataState' }, { name: 'SelectionState', optional: !showSelectionControls }, { name: 'IntegratedSelection', optional: !showSelectAll }, { name: 'Table' }, { name: 'TableHeaderRow', optional: true }]
        },
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableHeaderCellBefore',
            predicate: function predicate(_ref) {
              var column = _ref.column;
              return column.name === forColumnName;
            }
          },
          React.createElement(ExpandButton, {
            visible: false
          }),
          showSelectionControls && showSelectAll && React.createElement(
            dxReactCore.TemplateConnector,
            null,
            function (_ref2, _ref3) {
              var selectAllAvailable = _ref2.selectAllAvailable,
                  allSelected$$1 = _ref2.allSelected,
                  someSelected$$1 = _ref2.someSelected;
              var toggleSelectAll = _ref3.toggleSelectAll;
              return React.createElement(Checkbox, {
                disabled: !selectAllAvailable,
                checked: allSelected$$1,
                indeterminate: someSelected$$1,
                onChange: toggleSelectAll
              });
            }
          )
        ),
        React.createElement(
          dxReactCore.Template,
          {
            name: 'tableCell',
            predicate: function predicate(_ref4) {
              var tableRow = _ref4.tableRow,
                  tableColumn = _ref4.tableColumn;
              return dxGridCore.isTreeTableCell(tableRow, tableColumn, forColumnName);
            }
          },
          function (params) {
            return React.createElement(
              dxReactCore.TemplateConnector,
              null,
              function (_ref5, _ref6) {
                var getCollapsedRows = _ref5.getCollapsedRows,
                    expandedRowIds = _ref5.expandedRowIds,
                    selection = _ref5.selection,
                    isTreeRowLeaf = _ref5.isTreeRowLeaf,
                    getTreeRowLevel = _ref5.getTreeRowLevel,
                    getCellValue = _ref5.getCellValue;
                var toggleRowExpanded$$1 = _ref6.toggleRowExpanded,
                    toggleSelection$$1 = _ref6.toggleSelection;
                var _params$tableRow = params.tableRow,
                    row = _params$tableRow.row,
                    rowId = _params$tableRow.rowId;

                var columnName = params.tableColumn.column.name;
                var value = getCellValue(row, columnName);
                var collapsedRows = getCollapsedRows(row);
                return React.createElement(
                  dxReactCore.TemplatePlaceholder,
                  {
                    name: 'valueFormatter',
                    params: {
                      row: row,
                      column: params.tableColumn.column,
                      value: value
                    }
                  },
                  function (content) {
                    return React.createElement(
                      Cell,
                      _extends({}, params, {
                        row: row,
                        column: params.tableColumn.column,
                        value: value
                      }),
                      React.createElement(Indent, {
                        level: getTreeRowLevel(row)
                      }),
                      React.createElement(ExpandButton, {
                        visible: collapsedRows ? !!collapsedRows.length : !isTreeRowLeaf(row),
                        expanded: expandedRowIds.indexOf(rowId) > -1,
                        onToggle: function onToggle() {
                          return toggleRowExpanded$$1({ rowId: rowId });
                        }
                      }),
                      showSelectionControls && React.createElement(Checkbox, {
                        disabled: false,
                        checked: selection.indexOf(rowId) > -1,
                        indeterminate: false,
                        onChange: function onChange() {
                          return toggleSelection$$1({ rowIds: [rowId] });
                        }
                      }),
                      React.createElement(
                        Content,
                        null,
                        content || value
                      )
                    );
                  }
                );
              }
            );
          }
        )
      );
    }
  }]);
  return TableTreeColumn;
}(React.PureComponent);

TableTreeColumn.propTypes = {
  for: PropTypes.string.isRequired,
  showSelectionControls: PropTypes.bool,
  showSelectAll: PropTypes.bool,
  cellComponent: PropTypes.func.isRequired,
  indentComponent: PropTypes.func.isRequired,
  expandButtonComponent: PropTypes.func.isRequired,
  checkboxComponent: PropTypes.func.isRequired,
  contentComponent: PropTypes.func.isRequired
};

TableTreeColumn.defaultProps = {
  showSelectionControls: false,
  showSelectAll: false
};

var SearchState = function (_React$PureComponent) {
  inherits(SearchState, _React$PureComponent);

  function SearchState(props) {
    classCallCheck(this, SearchState);

    var _this = possibleConstructorReturn(this, (SearchState.__proto__ || Object.getPrototypeOf(SearchState)).call(this, props));

    _this.state = {
      value: props.value || props.defaultValue
    };
    var stateHelper = dxReactCore.createStateHelper(_this, {
      value: function value() {
        return _this.props.onValueChange;
      }
    });

    _this.changeValue = stateHelper.applyFieldReducer.bind(stateHelper, 'value', dxGridCore.changeSearchValue);
    return _this;
  }

  createClass(SearchState, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var value = nextProps.value;

      this.setState(_extends({}, value !== undefined ? { value: value } : null));
    }
  }, {
    key: 'render',
    value: function render() {
      var value = this.state.value;

      var filterExpressionComputed = function filterExpressionComputed(_ref) {
        var filterExpression$$1 = _ref.filterExpression,
            columns = _ref.columns;
        return dxGridCore.searchFilterExpression(value, columns, filterExpression$$1);
      };

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'SearchState'
        },
        React.createElement(dxReactCore.Getter, { name: 'filterExpression', computed: filterExpressionComputed }),
        React.createElement(dxReactCore.Getter, { name: 'searchValue', value: value }),
        React.createElement(dxReactCore.Action, { name: 'changeSearchValue', action: this.changeValue })
      );
    }
  }]);
  return SearchState;
}(React.PureComponent);

SearchState.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onValueChange: PropTypes.func
};

SearchState.defaultProps = {
  value: undefined,
  defaultValue: '',
  onValueChange: undefined
};

var pluginDependencies$19 = [{ name: 'Toolbar' }, { name: 'SearchState' }];

var SearchPanel = function (_React$PureComponent) {
  inherits(SearchPanel, _React$PureComponent);

  function SearchPanel() {
    classCallCheck(this, SearchPanel);
    return possibleConstructorReturn(this, (SearchPanel.__proto__ || Object.getPrototypeOf(SearchPanel)).apply(this, arguments));
  }

  createClass(SearchPanel, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          Input = _props.inputComponent,
          messages = _props.messages;

      var getMessage = dxGridCore.getMessagesFormatter(messages);

      return React.createElement(
        dxReactCore.Plugin,
        {
          name: 'SearchPanel',
          dependencies: pluginDependencies$19
        },
        React.createElement(
          dxReactCore.Template,
          { name: 'toolbarContent' },
          React.createElement(dxReactCore.TemplatePlaceholder, null),
          React.createElement(
            dxReactCore.TemplateConnector,
            null,
            function (_ref, _ref2) {
              var searchValue = _ref.searchValue;
              var changeSearchValue$$1 = _ref2.changeSearchValue;
              return React.createElement(Input, {
                value: searchValue,
                onValueChange: changeSearchValue$$1,
                getMessage: getMessage
              });
            }
          )
        )
      );
    }
  }]);
  return SearchPanel;
}(React.PureComponent);

SearchPanel.propTypes = {
  inputComponent: PropTypes.func.isRequired,
  messages: PropTypes.object
};

SearchPanel.defaultProps = {
  messages: {}
};

/* globals requestAnimationFrame */

var TABLE_FLEX_TYPE = 'flex';

var areColumnsChanged = function areColumnsChanged(prevColumns, nextColumns) {
  if (prevColumns.length !== nextColumns.length) return true;
  var prevKeys = prevColumns.map(function (column) {
    return column.key;
  });
  return nextColumns.find(function (column) {
    return prevKeys.indexOf(column.key) === -1;
  }) !== undefined;
};

var TableLayout = function (_React$PureComponent) {
  inherits(TableLayout, _React$PureComponent);

  function TableLayout(props) {
    classCallCheck(this, TableLayout);

    var _this = possibleConstructorReturn(this, (TableLayout.__proto__ || Object.getPrototypeOf(TableLayout)).call(this, props));

    _this.state = {
      animationState: new Map()
    };

    _this.animations = new Map();
    _this.tableNode = null;

    _this.setRef = function (ref) {
      if (ref) _this.tableNode = ref;
    };
    return _this;
  }

  createClass(TableLayout, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var nextColumns = nextProps.columns;
      var columns = this.props.columns;


      if (areColumnsChanged(columns, nextColumns)) return;

      // eslint-disable-next-line react/no-find-dom-node
      var tableWidth = reactDom.findDOMNode(this).scrollWidth;
      this.animations = dxGridCore.getAnimations(columns, nextColumns, tableWidth, this.animations);
      this.processAnimationFrame();
    }
  }, {
    key: 'getColumns',
    value: function getColumns() {
      var columns = this.props.columns;
      var animationState = this.state.animationState;


      var result = columns;

      var isFixedWidth = columns.filter(function (column) {
        return column.width === undefined;
      }).length === 0;
      if (isFixedWidth) {
        result = result.slice();
        result.push({ key: TABLE_FLEX_TYPE, type: TABLE_FLEX_TYPE });
      }

      if (animationState.size) {
        result = result.map(function (column) {
          return animationState.has(column.key) ? _extends({}, column, { animationState: animationState.get(column.key) }) : column;
        });
      }

      return result;
    }
  }, {
    key: 'processAnimationFrame',
    value: function processAnimationFrame() {
      this.animations = dxGridCore.filterActiveAnimations(this.animations);

      if (!this.animations.size) {
        if (this.state.animationState.size) {
          this.setState({ animationState: new Map() });
        }
        return;
      }

      var animationState = dxGridCore.evalAnimations(this.animations);
      this.setState({ animationState: animationState });

      requestAnimationFrame(this.processAnimationFrame.bind(this));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          Layout = _props.layoutComponent,
          minColumnWidth = _props.minColumnWidth,
          restProps = objectWithoutProperties(_props, ['layoutComponent', 'minColumnWidth']);

      var columns = this.getColumns();
      var minWidth = columns.map(function (column) {
        return column.width || (column.type === TABLE_FLEX_TYPE ? 0 : minColumnWidth);
      }).reduce(function (acc, width) {
        return acc + width;
      }, 0);

      return React.createElement(Layout, _extends({}, restProps, {
        columns: columns,
        minWidth: minWidth,
        minColumnWidth: minColumnWidth
      }));
    }
  }]);
  return TableLayout;
}(React.PureComponent);

TableLayout.propTypes = {
  columns: PropTypes.array.isRequired,
  minColumnWidth: PropTypes.number.isRequired,
  layoutComponent: PropTypes.func.isRequired
};

var ColumnGroup = function (_React$PureComponent) {
  inherits(ColumnGroup, _React$PureComponent);

  function ColumnGroup() {
    classCallCheck(this, ColumnGroup);
    return possibleConstructorReturn(this, (ColumnGroup.__proto__ || Object.getPrototypeOf(ColumnGroup)).apply(this, arguments));
  }

  createClass(ColumnGroup, [{
    key: 'render',
    value: function render() {
      var columns = this.props.columns;


      return React.createElement(
        'colgroup',
        null,
        columns.map(function (column) {
          return React.createElement('col', {
            key: column.key,
            style: column.width !== undefined ? { width: column.width + 'px' } : null
          });
        })
      );
    }
  }]);
  return ColumnGroup;
}(React.PureComponent);

ColumnGroup.propTypes = {
  columns: PropTypes.array.isRequired
};

var VirtualTableLayout = function (_React$PureComponent) {
  inherits(VirtualTableLayout, _React$PureComponent);

  function VirtualTableLayout(props) {
    classCallCheck(this, VirtualTableLayout);

    var _this = possibleConstructorReturn(this, (VirtualTableLayout.__proto__ || Object.getPrototypeOf(VirtualTableLayout)).call(this, props));

    _this.state = {
      rowHeights: new Map(),
      viewportTop: 0,
      viewportLeft: 0
    };

    _this.rowRefs = new Map();
    _this.registerRowRef = _this.registerRowRef.bind(_this);
    _this.getRowHeight = _this.getRowHeight.bind(_this);
    _this.updateViewport = _this.updateViewport.bind(_this);
    return _this;
  }

  createClass(VirtualTableLayout, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.storeRowHeights();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.headerRows !== nextProps.headerRows || this.props.bodyRows !== nextProps.bodyRows) {
        var prevRowHeight = this.state.rowHeights;

        var rowHeights = [].concat(toConsumableArray(nextProps.headerRows), toConsumableArray(nextProps.bodyRows)).reduce(function (acc, row) {
          var rowHeight = prevRowHeight.get(row.key);
          if (rowHeight !== undefined) {
            acc.set(row.key, rowHeight);
          }
          return acc;
        }, new Map());
        this.setState({ rowHeights: rowHeights });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.storeRowHeights();
    }
  }, {
    key: 'getRowHeight',
    value: function getRowHeight(row) {
      var storedHeight = this.state.rowHeights.get(row.key);
      if (storedHeight !== undefined) return storedHeight;
      if (row.height) return row.height;
      return this.props.estimatedRowHeight;
    }
  }, {
    key: 'storeRowHeights',
    value: function storeRowHeights() {
      var _this2 = this;

      var rowsWithChangedHeights = Array.from(this.rowRefs.entries())
      // eslint-disable-next-line react/no-find-dom-node
      .map(function (_ref) {
        var _ref2 = slicedToArray(_ref, 2),
            row = _ref2[0],
            ref = _ref2[1];

        return [row, reactDom.findDOMNode(ref)];
      }).filter(function (_ref3) {
        var _ref4 = slicedToArray(_ref3, 2),
            node$$1 = _ref4[1];

        return !!node$$1;
      }).map(function (_ref5) {
        var _ref6 = slicedToArray(_ref5, 2),
            row = _ref6[0],
            node$$1 = _ref6[1];

        return [row, node$$1.getBoundingClientRect().height];
      }).filter(function (_ref7) {
        var _ref8 = slicedToArray(_ref7, 2),
            row = _ref8[0],
            height = _ref8[1];

        return height !== _this2.getRowHeight(row);
      });

      if (rowsWithChangedHeights.length) {
        var rowHeights = this.state.rowHeights;

        rowsWithChangedHeights.forEach(function (_ref9) {
          var _ref10 = slicedToArray(_ref9, 2),
              row = _ref10[0],
              height = _ref10[1];

          return rowHeights.set(row.key, height);
        });

        this.setState({
          rowHeights: rowHeights
        });
      }
    }
  }, {
    key: 'registerRowRef',
    value: function registerRowRef(row, ref) {
      if (ref === null) {
        this.rowRefs.delete(row);
      } else {
        this.rowRefs.set(row, ref);
      }
    }
  }, {
    key: 'updateViewport',
    value: function updateViewport(e) {
      var node$$1 = e.target;

      // NOTE: prevent nested scroll to update viewport
      if (node$$1 !== e.currentTarget) {
        return;
      }

      // NOTE: prevent iOS to flicker in bounces
      if (node$$1.scrollTop < 0 || node$$1.scrollLeft < 0 || node$$1.scrollLeft + node$$1.clientWidth > node$$1.scrollWidth || node$$1.scrollTop + node$$1.clientHeight > node$$1.scrollHeight) {
        return;
      }

      this.setState({
        viewportTop: node$$1.scrollTop,
        viewportLeft: node$$1.scrollLeft
      });
    }
  }, {
    key: 'renderRowsBlock',
    value: function renderRowsBlock(collapsedGrid, Table, Body) {
      var _this3 = this;

      var _props = this.props,
          minWidth = _props.minWidth,
          Row = _props.rowComponent,
          Cell = _props.cellComponent;


      return React.createElement(
        Table,
        {
       //   style: { minWidth: minWidth + 'px' }
        },
        React.createElement(ColumnGroup, {
          columns: collapsedGrid.columns
        }),
        React.createElement(
          Body,
          null,
          collapsedGrid.rows.map(function (visibleRow) {
            var row = visibleRow.row,
                _visibleRow$cells = visibleRow.cells,
                cells = _visibleRow$cells === undefined ? [] : _visibleRow$cells;

            return React.createElement(
              dxReactCore.RefHolder,
              {
                key: row.key,
                ref: function ref(_ref11) {
                  return _this3.registerRowRef(row, _ref11);
                }
              },
              React.createElement(
                Row,
                {
                  tableRow: row,
                  style: row.height !== undefined ? { height: row.height + 'px' } : undefined
                },
                cells.map(function (cell) {
                  var column = cell.column;

                  return React.createElement(Cell, {
                    key: column.key,
                    tableRow: row,
                    tableColumn: column,
                    style: column.animationState,
                    colSpan: cell.colSpan
                  });
                })
              )
            );
          })
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props2 = this.props,
          headerRows = _props2.headerRows,
          bodyRows = _props2.bodyRows,
          columns = _props2.columns,
          minColumnWidth = _props2.minColumnWidth,
          height = _props2.height,
          Container = _props2.containerComponent,
          HeadTable = _props2.headTableComponent,
          Table = _props2.tableComponent,
          Head = _props2.headComponent,
          Body = _props2.bodyComponent,
          getCellColSpan = _props2.getCellColSpan;


      return React.createElement(
        dxReactCore.Sizer,
        null,
        function (_ref12) {
          var width = _ref12.width;

          var headHeight = headerRows.reduce(function (acc, row) {
            return acc + _this4.getRowHeight(row);
          }, 0);
          var getColSpan = function getColSpan(tableRow, tableColumn) {
            return getCellColSpan({ tableRow: tableRow, tableColumn: tableColumn, tableColumns: columns });
          };
          var collapsedHeaderGrid = dxGridCore.getCollapsedGrid({
            rows: headerRows,
            columns: columns,
            top: 0,
            left: _this4.state.viewportLeft,
            width: width,
            height: headHeight,
            getColumnWidth: function getColumnWidth(column) {
              return column.width || minColumnWidth;
            },
            getRowHeight: _this4.getRowHeight,
            getColSpan: getColSpan
          });
          var collapsedBodyGrid = dxGridCore.getCollapsedGrid({
            rows: bodyRows,
            columns: columns,
            top: _this4.state.viewportTop,
            left: _this4.state.viewportLeft,
            width: width,
            height: height - headHeight,
            getColumnWidth: function getColumnWidth(column) {
              return column.width || minColumnWidth;
            },
            getRowHeight: _this4.getRowHeight,
            getColSpan: getColSpan
          });

          return React.createElement(
            Container,
            {
              style: { height: height + 'px' },
              onScroll: _this4.updateViewport
            },
            !!headerRows.length && _this4.renderRowsBlock(collapsedHeaderGrid, HeadTable, Head),
            _this4.renderRowsBlock(collapsedBodyGrid, Table, Body)
          );
        }
      );
    }
  }]);
  return VirtualTableLayout;
}(React.PureComponent);

VirtualTableLayout.propTypes = {
  minWidth: PropTypes.number.isRequired,
  minColumnWidth: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  headerRows: PropTypes.array,
  bodyRows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  cellComponent: PropTypes.func.isRequired,
  rowComponent: PropTypes.func.isRequired,
  bodyComponent: PropTypes.func.isRequired,
  headComponent: PropTypes.func,
  tableComponent: PropTypes.func.isRequired,
  headTableComponent: PropTypes.func,
  containerComponent: PropTypes.func.isRequired,
  estimatedRowHeight: PropTypes.number.isRequired,
  getCellColSpan: PropTypes.func.isRequired
};

VirtualTableLayout.defaultProps = {
  headerRows: [],
  headComponent: function headComponent() {
    return null;
  },
  headTableComponent: function headTableComponent() {
    return null;
  }
};

var getColumnStyle = function getColumnStyle(_ref) {
  var column = _ref.column;
  return column.animationState;
};

var getRowStyle = function getRowStyle(_ref2) {
  var row = _ref2.row;
  return row.height !== undefined ? { height: row.height + 'px' } : undefined;
};

var RowLayout = function (_React$PureComponent) {
  inherits(RowLayout, _React$PureComponent);

  function RowLayout() {
    classCallCheck(this, RowLayout);
    return possibleConstructorReturn(this, (RowLayout.__proto__ || Object.getPrototypeOf(RowLayout)).apply(this, arguments));
  }

  createClass(RowLayout, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          row = _props.row,
          columns = _props.columns,
          Row = _props.rowComponent,
          Cell = _props.cellComponent,
          getCellColSpan = _props.getCellColSpan;

      var getColSpan = function getColSpan(tableRow, tableColumn) {
        return getCellColSpan({ tableRow: tableRow, tableColumn: tableColumn, tableColumns: columns });
      };

      return React.createElement(
        Row,
        {
          tableRow: row,
          style: getRowStyle({ row: row })
        },
        columns.map(function (column) {
          return React.createElement(Cell, {
            key: column.key,
            tableRow: row,
            tableColumn: column,
            style: getColumnStyle({ column: column }),
            colSpan: getColSpan(row, column)
          });
        })
      );
    }
  }]);
  return RowLayout;
}(React.PureComponent);

RowLayout.propTypes = {
  row: PropTypes.any.isRequired,
  columns: PropTypes.array.isRequired,
  rowComponent: PropTypes.func.isRequired,
  cellComponent: PropTypes.func.isRequired,
  getCellColSpan: PropTypes.func.isRequired
};

var RowsBlockLayout = function (_React$PureComponent) {
  inherits(RowsBlockLayout, _React$PureComponent);

  function RowsBlockLayout() {
    classCallCheck(this, RowsBlockLayout);
    return possibleConstructorReturn(this, (RowsBlockLayout.__proto__ || Object.getPrototypeOf(RowsBlockLayout)).apply(this, arguments));
  }

  createClass(RowsBlockLayout, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          rows = _props.rows,
          columns = _props.columns,
          Block = _props.blockComponent,
          rowComponent = _props.rowComponent,
          cellComponent = _props.cellComponent,
          getCellColSpan = _props.getCellColSpan;


      return React.createElement(
        Block,
        null,
        rows.map(function (row) {
          return React.createElement(RowLayout, {
            key: row.key,
            row: row,
            columns: columns,
            rowComponent: rowComponent,
            cellComponent: cellComponent,
            getCellColSpan: getCellColSpan
          });
        })
      );
    }
  }]);
  return RowsBlockLayout;
}(React.PureComponent);

RowsBlockLayout.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  blockComponent: PropTypes.func.isRequired,
  rowComponent: PropTypes.func.isRequired,
  cellComponent: PropTypes.func.isRequired,
  getCellColSpan: PropTypes.func.isRequired
};

var StaticTableLayout = function (_React$PureComponent) {
  inherits(StaticTableLayout, _React$PureComponent);

  function StaticTableLayout() {
    classCallCheck(this, StaticTableLayout);
    return possibleConstructorReturn(this, (StaticTableLayout.__proto__ || Object.getPrototypeOf(StaticTableLayout)).apply(this, arguments));
  }

  createClass(StaticTableLayout, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          headerRows = _props.headerRows,
          bodyRows = _props.bodyRows,
          columns = _props.columns,
          minWidth = _props.minWidth,
          Container = _props.containerComponent,
          Table = _props.tableComponent,
          headComponent = _props.headComponent,
          bodyComponent = _props.bodyComponent,
          rowComponent = _props.rowComponent,
          cellComponent = _props.cellComponent,
          getCellColSpan = _props.getCellColSpan;


      return React.createElement(
        Container,
        null,
        React.createElement(
          Table,
          {
            style: { minWidth: minWidth + 'px' }
          },
          React.createElement(ColumnGroup, { columns: columns }),
          !!headerRows.length && React.createElement(RowsBlockLayout, {
            rows: headerRows,
            columns: columns,
            blockComponent: headComponent,
            rowComponent: rowComponent,
            cellComponent: cellComponent,
            getCellColSpan: getCellColSpan
          }),
          React.createElement(RowsBlockLayout, {
            rows: bodyRows,
            columns: columns,
            blockComponent: bodyComponent,
            rowComponent: rowComponent,
            cellComponent: cellComponent,
            getCellColSpan: getCellColSpan
          })
        )
      );
    }
  }]);
  return StaticTableLayout;
}(React.PureComponent);

StaticTableLayout.propTypes = {
  headerRows: PropTypes.array,
  bodyRows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  minWidth: PropTypes.number.isRequired,
  containerComponent: PropTypes.func.isRequired,
  tableComponent: PropTypes.func.isRequired,
  headComponent: PropTypes.func,
  bodyComponent: PropTypes.func.isRequired,
  rowComponent: PropTypes.func.isRequired,
  cellComponent: PropTypes.func.isRequired,
  getCellColSpan: PropTypes.func.isRequired
};

StaticTableLayout.defaultProps = {
  headerRows: [],
  headComponent: function headComponent() {
    return null;
  }
};

var ItemLayout = function (_React$PureComponent) {
  inherits(ItemLayout, _React$PureComponent);

  function ItemLayout(props) {
    classCallCheck(this, ItemLayout);

    var _this = possibleConstructorReturn(this, (ItemLayout.__proto__ || Object.getPrototypeOf(ItemLayout)).call(this, props));

    _this.state = {
      dragging: false
    };
    return _this;
  }

  createClass(ItemLayout, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          item = _props.item,
          Item = _props.itemComponent,
          draggingEnabled = _props.draggingEnabled,
          onDragStart = _props.onDragStart,
          onDragEnd = _props.onDragEnd;
      var dragging = this.state.dragging;


      var itemElement = React.createElement(Item, { item: _extends({}, item, { draft: dragging || item.draft }) });

      return draggingEnabled ? React.createElement(
        dxReactCore.DragSource,
        {
          payload: [{ type: 'column', columnName: item.column.name }],
          onStart: function onStart() {
            _this2.setState({ dragging: true });
            onDragStart();
          },
          onEnd: function onEnd() {
            _this2.setState({ dragging: false });
            onDragEnd();
          }
        },
        itemElement
      ) : itemElement;
    }
  }]);
  return ItemLayout;
}(React.PureComponent);

ItemLayout.propTypes = {
  item: PropTypes.shape({
    column: PropTypes.object,
    draft: PropTypes.bool
  }).isRequired,
  itemComponent: PropTypes.func.isRequired,
  draggingEnabled: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func
};

ItemLayout.defaultProps = {
  draggingEnabled: false,
  onDragStart: function onDragStart() {},
  onDragEnd: function onDragEnd() {}
};

var GroupPanelLayout = function (_React$PureComponent) {
  inherits(GroupPanelLayout, _React$PureComponent);

  function GroupPanelLayout(props) {
    classCallCheck(this, GroupPanelLayout);

    var _this = possibleConstructorReturn(this, (GroupPanelLayout.__proto__ || Object.getPrototypeOf(GroupPanelLayout)).call(this, props));

    _this.state = {
      sourceColumnName: null,
      targetItemIndex: -1
    };
    _this.handleDragEvent = function (eventHandler, _ref) {
      var payload = _ref.payload,
          restArgs = objectWithoutProperties(_ref, ['payload']);
      var isColumnGroupingEnabled = _this.props.isColumnGroupingEnabled;
      var columnName = payload[0].columnName;


      if (isColumnGroupingEnabled(columnName)) {
        eventHandler(_extends({ payload: payload }, restArgs));
      }
    };
    _this.onEnter = function (_ref2) {
      var payload = _ref2.payload;

      _this.setState({
        sourceColumnName: payload[0].columnName
      });
    };
    _this.onOver = function (_ref3) {
      var clientOffset = _ref3.clientOffset;
      var _this$props = _this.props,
          onGroupDraft = _this$props.onGroupDraft,
          items = _this$props.items;
      var _this$state = _this.state,
          sourceColumnName = _this$state.sourceColumnName,
          prevTargetItemIndex = _this$state.targetItemIndex;
      // eslint-disable-next-line react/no-find-dom-node

      var itemGeometries = _this.itemRefs.map(function (ref) {
        return reactDom.findDOMNode(ref).getBoundingClientRect();
      });
      var sourceItemIndex = items.findIndex(function (_ref4) {
        var column = _ref4.column;
        return column.name === sourceColumnName;
      });
      var targetItemIndex = dxGridCore.getGroupCellTargetIndex(itemGeometries, sourceItemIndex, clientOffset);

      if (prevTargetItemIndex === targetItemIndex) return;

      onGroupDraft({
        columnName: sourceColumnName,
        groupIndex: targetItemIndex
      });
      _this.setState({ targetItemIndex: targetItemIndex });
    };
    _this.onLeave = function () {
      var onGroupDraft = _this.props.onGroupDraft;
      var sourceColumnName = _this.state.sourceColumnName;

      if (!_this.draggingColumnName) {
        _this.resetState();
        return;
      }
      onGroupDraft({
        columnName: sourceColumnName,
        groupIndex: -1
      });
      _this.setState({
        targetItemIndex: -1
      });
    };
    _this.onDrop = function () {
      var onGroup = _this.props.onGroup;
      var _this$state2 = _this.state,
          sourceColumnName = _this$state2.sourceColumnName,
          targetItemIndex = _this$state2.targetItemIndex;

      _this.resetState();
      onGroup({
        columnName: sourceColumnName,
        groupIndex: targetItemIndex
      });
    };
    _this.onDragStart = function (columnName) {
      _this.draggingColumnName = columnName;
    };
    _this.onDragEnd = function () {
      _this.draggingColumnName = null;
      var _this$state3 = _this.state,
          sourceColumnName = _this$state3.sourceColumnName,
          targetItemIndex = _this$state3.targetItemIndex;
      var onGroup = _this.props.onGroup;

      if (sourceColumnName && targetItemIndex === -1) {
        onGroup({
          columnName: sourceColumnName
        });
      }
      _this.resetState();
    };
    return _this;
  }

  createClass(GroupPanelLayout, [{
    key: 'resetState',
    value: function resetState() {
      var onGroupDraftCancel = this.props.onGroupDraftCancel;

      onGroupDraftCancel();
      this.setState({
        sourceColumnName: null,
        targetItemIndex: -1
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          items = _props.items,
          EmptyMessage = _props.emptyMessageComponent,
          Container = _props.containerComponent,
          Item = _props.itemComponent,
          draggingEnabled = _props.draggingEnabled,
          isColumnGroupingEnabled = _props.isColumnGroupingEnabled;


      this.itemRefs = [];

      var groupPanel = items.length ? React.createElement(
        Container,
        null,
        items.map(function (item) {
          var columnName = item.column.name;

          return React.createElement(ItemLayout, {
            key: columnName,
            ref: function ref(element) {
              return element && _this2.itemRefs.push(element);
            },
            item: item,
            itemComponent: Item,
            draggingEnabled: draggingEnabled && isColumnGroupingEnabled(columnName),
            onDragStart: function onDragStart() {
              return _this2.onDragStart(columnName);
            },
            onDragEnd: _this2.onDragEnd
          });
        })
      ) : React.createElement(EmptyMessage, null);

      return draggingEnabled ? React.createElement(
        dxReactCore.DropTarget,
        {
          onEnter: function onEnter(args) {
            return _this2.handleDragEvent(_this2.onEnter, args);
          },
          onOver: function onOver(args) {
            return _this2.handleDragEvent(_this2.onOver, args);
          },
          onLeave: function onLeave(args) {
            return _this2.handleDragEvent(_this2.onLeave, args);
          },
          onDrop: function onDrop(args) {
            return _this2.handleDragEvent(_this2.onDrop, args);
          }
        },
        groupPanel
      ) : groupPanel;
    }
  }]);
  return GroupPanelLayout;
}(React.PureComponent);

GroupPanelLayout.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    column: PropTypes.object,
    draft: PropTypes.bool
  })).isRequired,
  onGroup: PropTypes.func,
  itemComponent: PropTypes.func.isRequired,
  containerComponent: PropTypes.func.isRequired,
  emptyMessageComponent: PropTypes.func.isRequired,
  draggingEnabled: PropTypes.bool,
  isColumnGroupingEnabled: PropTypes.func,
  onGroupDraft: PropTypes.func,
  onGroupDraftCancel: PropTypes.func
};

GroupPanelLayout.defaultProps = {
  onGroup: function onGroup() {},
  draggingEnabled: false,
  isColumnGroupingEnabled: function isColumnGroupingEnabled() {},
  onGroupDraft: function onGroupDraft() {},
  onGroupDraftCancel: function onGroupDraftCancel() {}
};

exports.Grid = Grid;
exports.ColumnChooser = ColumnChooser;
exports.FilteringState = FilteringState;
exports.IntegratedFiltering = IntegratedFiltering;
exports.EditingState = EditingState;
exports.PagingState = PagingState;
exports.IntegratedPaging = IntegratedPaging;
exports.CustomPaging = CustomPaging;
exports.GroupingState = GroupingState;
exports.IntegratedGrouping = IntegratedGrouping;
exports.CustomGrouping = CustomGrouping;
exports.SelectionState = SelectionState;
exports.IntegratedSelection = IntegratedSelection;
exports.SortingState = SortingState;
exports.IntegratedSorting = IntegratedSorting;
exports.DragDropProvider = DragDropProvider$1;
exports.TableColumnReordering = TableColumnReordering;
exports.Table = Table;
exports.TableSelection = TableSelection;
exports.RowDetailState = RowDetailState;
exports.TableRowDetail = TableRowDetail;
exports.TableGroupRow = TableGroupRow;
exports.TableHeaderRow = TableHeaderRow;
exports.TableBandHeader = TableBandHeader;
exports.TableFilterRow = TableFilterRow;
exports.TableEditRow = TableEditRow;
exports.TableEditColumn = TableEditColumn;
exports.TableColumnResizing = TableColumnResizing;
exports.PagingPanel = PagingPanel;
exports.GroupingPanel = GroupingPanel;
exports.DataTypeProvider = DataTypeProvider;
exports.TableColumnVisibility = TableColumnVisibility;
exports.Toolbar = Toolbar;
exports.TreeDataState = TreeDataState;
exports.CustomTreeData = CustomTreeData;
exports.TableTreeColumn = TableTreeColumn;
exports.SearchState = SearchState;
exports.SearchPanel = SearchPanel;
exports.TableLayout = TableLayout;
exports.VirtualTableLayout = VirtualTableLayout;
exports.StaticTableLayout = StaticTableLayout;
exports.GroupPanelLayout = GroupPanelLayout;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=dx-react-grid.umd.js.map
