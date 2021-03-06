namespace("fx.quadrantProperties")["simpleBarChart"] = (function (ko, _, leesa, fx, fxDataContext, fxUtil, fxEnum, Quill) {

    //#region shorthand

    var observable = ko.observable;
    var observableArray = ko.observableArray;
    var computed = ko.computed;
    var pureComputed = ko.pureComputed;

    var stackModeEnum = leesa.csEnum.stackMode;

    var enumPropertyType = fxEnum.csPropertyType;
    var enumPropertyTypeMeasurement = enumPropertyType.measurement.name;
    var enumPropertyTypeDimension = enumPropertyType.dimension.name;

    var fxUnwrap = fxUtil.unwrap;
    var isDimension = fxUtil.isDimension;
    var isMeasurement = fxUtil.isMeasurement;
    //var bindingSorting = fxUtil.bindingSorting;
    var bindingPropertyType = fxUtil.bindingPropertyType;
    var bindingPriority = fxUtil.bindingPriority;
    var getBindingName = fxUtil.bindingName;

    var isArray = _.isArray;


    function viewModel(params) {

        //#region Param properties
        var fxQuadrant = params.quadrantViewModel;

        var refreshQuadrant = fxQuadrant.refreshQuadrant;

        var koIsLiveSource = fxQuadrant.isLiveSource;

        var quadrantComposer = fxQuadrant.quadrantComposer;
        var projectionEntityManager = quadrantComposer.projectionEntityManager;
        var koProjections = projectionEntityManager.entities;
        var refreshVisual = quadrantComposer.refreshVisual;
        var koQuadrant = quadrantComposer.quadrant;
        var koSource = quadrantComposer.source;
        var koVisual = quadrantComposer.visual;
        var koSelectedConnectionSource = computed(function () {
            return fxQuadrant.selectedConnectionSource();
        });


        //console.log(koVisual(), koQuadrant()) // uncomment to see what you have
        var properties = [{
                propertyName: "valueField"
            }, {
                propertyName: "columnField"
            }
            // {
            //propertyName (required)
            //propertyBinding
            //defaultValue
            // }
        ]
        //#endregion

        init();
        //#region Private Methods

        function init() {
            initProperties();
            initSubscribers();
            initValues();
            initEvents();
        }

        function initProperties() {
            //check for every property in properties, if there is no propertyBinding, then it will create a default observable
            for (var i = 0; i < properties.length; i++) {
                var property = properties[i];
                if (!("propertyBinding" in property))
                    property.propertyBinding = observable();
                //this won't replace the edit mode value, because we haven't initialize subscribers
                if ("defaultValue" in property)
                    property.propertyBinding(property.defaultValue);
            }
        }

        function initSubscribers() {
            //subscribe every observable binding in property to update the parameter value in visual parameter
            for (var i = 0; i < properties.length; i++) {
                var property = properties[i];
                var kopropertyBinding = property.propertyBinding;
                var propertyName = property.propertyName;
                (function (name) {
                    kopropertyBinding.subscribe(function (value) {
                        setParameterValue(name, value);
                    })

                })(propertyName)
            }
        }


        function initValues() {
            //if in edit mode there are some value, this will put the value to each particular property binding
            var parameters = koVisual().parameters || {};
            for (var i = 0; i < properties.length; i++) {
                var property = properties[i];
                var parameterValue = parameters[property.propertyName]
                if (parameterValue != undefined) {
                    property.propertyBinding(parameterValue);
                }
            }
        }

        function initEvents() {
            projectionsChangeEventSubscription = koProjections.subscribe(function (newProjectionContexts) {
                var source = koSource();
                source.projections = _.map(newProjectionContexts, fxUnwrap);
                refreshQuadrant();
            });

            //COLOR PALETTE
            ko.bindingHandlers.toggleDropdown = {
                init: function (element, valueAccessor) {
                    var value = valueAccessor();

                    ko.utils.registerEventHandler(element, "click", function () {
                        if (value() == "0px")
                            value("200px");
                        else
                            value("0px");
                    });
                }
            }
            //COLOR PALETTE

        }

        //#region Converter

        //#endregion

        function getParameterValue(path) {
            var visual = koVisual();
            var parameters = visual.parameters || {};
            return parameters[path];
        }

        function setParameterValue(path, value) {
            var visual = koVisual();
            var parameters = visual.parameters || {};
            parameters[path] = value;
            visual.parameters = parameters;
            refreshQuadrant()
        }

        function removeParameterValue(visual, path) {
            var parameters = visual.parameters;
            if (!parameters)
                return;
            delete parameters[path];
        }

        function generatePropertyBindings() {
            var bindings = {};
            for (var i = 0; i < properties.length; i++) {
                var property = properties[i];
                var propertyName = property.propertyName;
                var propertyBinding = property.propertyBinding;
                bindings[propertyName] = propertyBinding;
            }
            return bindings;
        }

        //#endregion

        var me = this;
        $.extend(true, me, generatePropertyBindings(), {
            quadrantViewModel: fxQuadrant,
            // Properties
            quadrant: koQuadrant,
            quadrantComposer: quadrantComposer,
            selectedConnectionSource: koSelectedConnectionSource,

            //some observables properties already generated by generatePropertyBindings

            //observables

            //COLOR PALETTE
            // colorDropdown: colorDropdown,
            // colorPalette: koColorPalettes,
            // selectedColor: koSelectedColor,
            // selectedColorName: koSelectedColorName,
            // changeColorEvent: changeColorEvent,
            //COLOR PALETTE
            // Computed
            // Action
            //Events
        });

        return;
    }

    viewModel.prototype.dispose = function () {
        var subscription = this.projectionsChangeEventSubscription;
        if (subscription)
            subscription.dispose();
    }

    return {
        viewModel: viewModel
    };
})(ko, _, leesa, fx, fx.DataContext, fx.util, fx.enum, Quill);