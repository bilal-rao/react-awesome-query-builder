import React from 'react';
import {
    TextWidget,
    NumberWidget,
    SelectWidget,
    MultiSelectWidget,
    DateWidget,
    BooleanWidget,
    TimeWidget,
    DateTimeWidget
} from 'react-query-builder/components/widgets';
import {ProximityOperator} from 'react-query-builder/components/operators';
import {ComplexQueryOptions} from 'react-query-builder/components/options';

export default {
    conjunctions: {
        AND: {
            label: 'And',
        },
        OR: {
            label: 'Or',
        },
    },
    fields: {
        members: {
            label: 'Members',
            widget: '!struct',
            subfields: {
                subname: {
                    //label: 'Subname', //'subname' should be used instead
                    label2: 'MemberName',
                    widget: 'text',
                    operators: ['proximity', 'complexQuery'],
                },
            }
        },
        name: {
            label: 'Name',
            widget: 'text',
            operators: ['equal', 'not_equal'],
            defaultOperator: 'not_equal',
        },
        num: {
            label: 'Number',
            widget: 'number',
            widgetProps: {
                min: 2,
                max: 5
            }
        },
        date: {
            label: 'Date',
            widget: 'date',
        },
        time: {
            label: 'Time',
            widget: 'time',
        },
        datetime: {
            label: 'DateTime',
            widget: 'datetime',
        },
        color: {
            label: 'Color',
            widget: 'select',
            listValues: {
                yellow: 'Yellow',
                green: 'Green',
                orange: 'Orange'
            },
        },
        multicolor: {
            label: 'Colors',
            widget: 'multiselect',
            listValues: {
                yellow: 'Yellow',
                green: 'Green',
                orange: 'Orange'
            },
        },
    },
    operators: {
        equal: {label: '=='},
        not_equal: {label: '!='},
        less: {label: '<'},
        less_or_equal: {label: '<='},
        greater: {label: '>'},
        greater_or_equal: {label: '>='},

        between: {
            label: 'Between',
            cardinality: 2,
            valueLabels: [
                'Value from', 
                'Value to'
            ],
        },
        not_between: {
            label: 'Not between',
            cardinality: 2,
            valueLabels: [
                'Value from', 
                'Value to'
            ],
        },

        is_empty: {
            label: 'Is Empty',
            cardinality: 0,
        },
        is_not_empty: {
            label: 'Is not empty',
            cardinality: 0,
        },
        select_equals: {
            label: '==',
            value: (value, field, operatorOptions, valueOptions, operator, config, fieldDefinition) => `${field}:${fieldDefinition.options[value.first()]}`
        },
        select_in: {
            label: 'In',
            value: (value, field, operatorOptions, valueOptions, operator, config, fieldDefinition) => {
                console.log(2, value);
                return '';
            }
        },
        proximity: {
          label: 'Proximity search',
          cardinality: 2,
          valueLabels: [
            'Word 1', 
            'Word 2'
          ],
          value: (value, field, options) => {
            const output = value.map(currentValue => currentValue.indexOf(' ') !== -1 ? `\\"${currentValue}\\"` : currentValue);
            return `${field}:"(${output.join(') (')})"~${options.get('proximity')}`;
          },
          options: {
            optionLabel: "Words between",
            factory: (props) => <ProximityOperator {...props} />,
            defaults: {
              proximity: 2
            }
          }
        },
        complexQuery: {
          label: 'Complex query',
          cardinality: 2,
          value: (value, field, operatorOptions, valueOptions, operator, config) => {
            const output = value
              .map((currentValue, delta) => {
                const operatorDefinition = config.operators[operator];
                const selectedOperator = valueOptions.getIn([delta + '', 'operator'], 'contains');
                const valueFn = operatorDefinition.valueOptions.operators[selectedOperator].value;
                return valueFn(currentValue);
              }).map((currentValue) => currentValue.indexOf(' ') !== -1 ? `\\"${currentValue}\\"` : currentValue);

            return `{!complexphrase}${field}:"(${output.join(') (')})"~${operatorOptions.get('proximity')}`;
          },
          options: {
            optionLabel: "Words between",
            factory: (props) => <ProximityOperator {...props} />,
            defaults: {
              proximity: 2
            }
          },
          valueOptions: {
            factory: (props) => <ComplexQueryOptions {...props} />,
            operators: {
              contains: {
                label: 'Contains',
                value: (value) => `*${value}*`
              },
              startsWith: {
                label: 'Starts with',
                value: (value) => `${value}*`
              },
              endsWith: {
                label: 'Ends with',
                value: (value) => `*${value}`
              }
            },
            defaults: {
              operator: 'contains',
              proximity: 2
            }
          }
        },
    },
    widgets: {
        text: {
            factory: (props) => <TextWidget {...props} />,
            operators: [
                'equal',
                'not_equal',
                "is_empty",
                "is_not_empty",
            ]
        },
        number: {
            factory: (props) => <NumberWidget {...props} />,
            operators: [
                "equal",
                "not_equal",
                "less",
                "less_or_equal",
                "greater",
                "greater_or_equal",
                "between",
                "not_between",
            ],
            defaultOperator: 'less', //todo test
        },
        select: {
            factory: (props) => <SelectWidget {...props} />,
            operators: ['select_equals']
        },
        multiselect: {
            factory: (props) => <MultiSelectWidget {...props} />,
            operators: ['select_in']
        },
        date: {
            factory: (props) => <DateWidget {...props} />,
            dateFormat: 'DD.MM.YYYY',
            valueFormat: 'YYYY-MM-DD',
            locale: 'ru',
            operators: [
                "equal",
                "not_equal",
                "less",
                "less_or_equal",
                "greater",
                "greater_or_equal",
                "between",
                "not_between",
                "is_empty",
                "is_not_empty",
            ]
        },
        time: {
            factory: (props) => <TimeWidget {...props} />,
            timeFormat: 'HH:mm',
            valueFormat: 'HH:mm:ss',
            locale: 'ru',
            operators: [
                "equal",
                "not_equal",
                "less",
                "less_or_equal",
                "greater",
                "greater_or_equal",
                "between",
                "not_between",
                "is_empty",
                "is_not_empty",
            ]
        },
        datetime: {
            factory: (props) => <DateTimeWidget {...props} />,
            timeFormat: 'HH:mm',
            dateFormat: 'DD.MM.YYYY',
            valueFormat: 'YYYY-MM-DD HH:mm:ss',
            locale: 'ru',
            operators: [
                "equal",
                "not_equal",
                "less",
                "less_or_equal",
                "greater",
                "greater_or_equal",
                "between",
                "not_between",
                "is_empty",
                "is_not_empty",
            ]
        },
        boolean: {
            factory: (props) => <BooleanWidget {...props} />
        }
    },
    settings: {
        renderSize: 'small',
        renderConjsAsRadios: false,
        renderFieldAndOpAsDropdown: true,
        setOpOnChangeField: ['default'], // 'default' (default if present), 'keep' (keep prev from last field), 'first', 'none'
        setDefaultFieldAndOp: false,
        maxNesting: 10,
        fieldSeparator: '.',
        fieldSeparatorDisplay: '->',
        showLabels: true,
        valueLabel: "Value",
        fieldLabel: "Field",
        operatorLabel: "Operator",
        selectFieldLabel: "Select field",
        selectOperatorLabel: "Select operator",
        deleteLabel: null,
        addGroupLabel: "Add group",
        addRuleLabel: "Add rule",
        delGroupLabel: null,
    }
};
