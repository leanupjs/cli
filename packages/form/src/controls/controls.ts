import { ListOf } from '@leanup/lib/pattern/list-of';

import { FormatHandler } from '../handlers/format.handler';
import { ValidationHandler } from '../handlers/validation.handler';

abstract class AbstractControl {
  public readonly changeListeners: ListOf<Function> = new ListOf(Function);

  private readonly _errors: Set<string> = new Set<string>();
  private readonly _parentForms: FormControl[] = [];
  private _name = 'unnamed';
  private _validationHandler: ValidationHandler = new ValidationHandler();
  private _notifyTimeout: NodeJS.Timeout = setTimeout(() => {}, 0);

  constructor(name: string) {
    this.name = name;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    if (typeof value === 'string') {
      if (value.length > 0) {
        this._name = value;
      } else {
        throw new Error('The name of a control must have a min-length of 1.');
      }
    } else {
      throw new Error('The name of a control must be a string.');
    }
  }

  get error(): string | null {
    if (this._errors.size > 0) {
      return this._errors.values().next().value;
    } else {
      return null;
    }
  }

  protected getErrors() {
    return this._errors;
  }

  get id(): string {
    let id = this.name;
    if (this._parentForms.length > 0) {
      id = `${this._parentForms[0].id}_${id}`;
    }
    return id;
  }

  get valid(): boolean {
    return this._errors.size === 0;
  }

  // ES5
  protected es5isValid(): boolean {
    return this._errors.size === 0;
  }

  public findMeInParentForm(control: AbstractControl): boolean {
    if (this === control) {
      return true;
    }
    if (control instanceof FormControl) {
      const findings: FormControl[] = [];
      this._parentForms.forEach((formControl: FormControl) => {
        if (formControl.findMeInParentForm(control) === true) {
          findings.push(formControl);
        }
      });
      return findings.length > 0;
    } else {
      return false;
    }
  }

  public addParentForm(form: FormControl) {
    if (this._parentForms.includes(form) === false) {
      if (form.findMeInParentForm(this) === false) {
        this._parentForms.push(form);
      } else {
        throw new Error(`The same form control (${form.name}) leads to a form control loop.`);
      }
    } else {
      throw new Error(`An form control with the name '${form.name}' already exists.`);
    }
  }

  public removeParentForm(form: FormControl) {
    const index = this._parentForms.indexOf(form);
    if (index >= 0) {
      this._parentForms.splice(index, 1);
    } else {
      throw new Error(`An form control with the name '${form.name}' does not exists.`);
    }
  }

  protected setValidationHandler(validationHandler: ValidationHandler, value: unknown = null) {
    this._validationHandler = validationHandler;
    this.validate(value);
    // this.notify(); redundant?!
  }

  protected validate(value: unknown) {
    this._errors.clear();
    const errors = this._validationHandler.validate(value);
    errors.forEach((error: string) => {
      this._errors.add(error);
    });
    this._parentForms.forEach((formControl: FormControl) => {
      formControl.validate(value);
    });
  }

  protected notify() {
    if (this._notifyTimeout) {
      clearTimeout(this._notifyTimeout);
    }
    this._notifyTimeout = setTimeout(() => {
      this.changeListeners.forEach((changeListener: Function) => {
        changeListener();
      });
    }, 0);
  }
}

export enum InputControlTypes {
  checkbox = 'checkbox',
  date = 'date',
  email = 'email',
  number = 'number',
  password = 'password',
  radio = 'radio',
  select = 'select',
  slider = 'slider',
  text = 'text',
}
export interface InputControlProps {
  info?: string;
  label?: string;
  disabled?: boolean;
  mandatory?: boolean;
  readonly?: boolean;
  placeholder?: string;
  type?: string;
  value?: unknown;
}

export class InputControl extends AbstractControl implements InputControlProps {
  private _disabled = false;
  private _info = '';
  private _label = '';
  private _mandatory = false;
  private _placeholder = '';
  private _readonly = false;
  private _type = 'text';
  private _value: unknown = null;
  private _oldValue: unknown = null;
  private _valueTimeout: NodeJS.Timeout = setTimeout(() => {}, 0);
  private _formatHandler: FormatHandler = new FormatHandler();

  constructor(name: string, properties?: InputControlProps) {
    super(name);
    if (properties) {
      this.info = properties.info ? properties.info : '';
      this.label = properties.label ? properties.label : '';
      this.disabled = properties.disabled ? properties.disabled : false;
      this.mandatory = properties.mandatory ? properties.mandatory : false;
      this.readonly = properties.readonly ? properties.readonly : false;
      this.placeholder = properties.placeholder ? properties.placeholder : '';
      this.type = properties.type ? properties.type : 'text';
      this.value = properties.value ? properties.value : null;
    }
  }

  get info(): string {
    return this._info;
  }
  set info(value: string) {
    if (typeof value === 'string') {
      this._info = value;
      this.notify();
    } else {
      throw new Error('The info of a input control must be a string.');
    }
  }

  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    if (typeof value === 'boolean') {
      this._disabled = value;
      this.notify();
    } else {
      throw new Error('The disabled flag of a input control must be a string.');
    }
  }

  get mandatory(): boolean {
    return this._mandatory;
  }
  set mandatory(value: boolean) {
    if (typeof value === 'boolean') {
      this._mandatory = value;
      this.notify();
    } else {
      throw new Error('The mandatory flag of a input control must be a string.');
    }
  }

  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: boolean) {
    if (typeof value === 'boolean') {
      this._readonly = value;
      this.notify();
    } else {
      throw new Error('The readonly flag of a input control must be a string.');
    }
  }

  get label(): string {
    return this._label;
  }
  set label(value: string) {
    if (typeof value === 'string') {
      this._label = value;
      this.notify();
    } else {
      throw new Error('The label of a input control must be a string.');
    }
  }

  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    if (typeof value === 'string') {
      this._placeholder = value;
      this.notify();
    } else {
      throw new Error('The placeholder of a input control must be a string.');
    }
  }

  get type(): string {
    return this._type.toString();
  }
  set type(value: string) {
    if (typeof value === 'string') {
      // https://developer.mozilla.org/de/docs/Web/HTML/Element/Input#Arten_des_%3Cinput%3E-Elements
      switch (value) {
        case 'checkbox':
        case 'date':
        case 'email':
        case 'number':
        case 'password':
        case 'radio':
        case 'select':
        case 'slider':
        case 'text':
          this._type = value;
          this.notify();
          break;
        default:
          throw new Error('The type of a input control must be a of the following types: ???.');
      }
    } else {
      throw new Error('The type of a input control must be a string.');
    }
  }

  get oldValue(): unknown {
    return this._oldValue;
  }

  get value(): unknown {
    return this._value;
  }
  set value(value: unknown) {
    if (this._valueTimeout) {
      clearTimeout(this._valueTimeout);
    }
    this._valueTimeout = setTimeout(() => {
      this.validate(value); // execution?!
      this._oldValue = this._value;
      this._value = value;
      this.notify();
    }, 0);
  }

  get modelValue(): unknown {
    return this.value;
  }
  set modelValue(value: unknown) {
    this.value = value;
  }

  get viewValue(): unknown {
    return this._formatHandler.format(this.modelValue);
  }
  set viewValue(value: unknown) {
    this.modelValue = this._formatHandler.parse(value);
  }

  public setValidationHandler(validationHandler: ValidationHandler) {
    super.setValidationHandler(validationHandler, this.value);
  }

  public setFormatHandler(formatHandler: FormatHandler) {
    this._formatHandler = formatHandler;
  }
}

export class FormControl extends AbstractControl {
  private readonly controls: ListOf<FormControl | InputControl> = new ListOf([FormControl, InputControl]);

  get disabled(): boolean {
    return (
      this.controls.filter((control: FormControl | InputControl) => {
        return control.disabled === false;
      }).length === 0
    );
  }
  set disabled(value: boolean) {
    this.controls.forEach((control: FormControl | InputControl) => {
      control.disabled = value;
    });
  }

  get readonly(): boolean {
    return (
      this.controls.filter((control: FormControl | InputControl) => {
        return control.readonly === false;
      }).length === 0
    );
  }
  set readonly(value: boolean) {
    this.controls.forEach((control: FormControl | InputControl) => {
      control.readonly = value;
    });
  }

  get valid(): boolean {
    return (
      this.es5isValid() && // ES5
      this.controls.filter((control: FormControl | InputControl) => {
        return control.valid === false;
      }).length === 0
    );
  }

  public addConrol(control: FormControl | InputControl): void {
    if (this.controls.contains(control) === false) {
      control.addParentForm(this);
      this.controls.add(control);
    } else {
      throw new Error(`A control with the same name '${control.name}' already exists.`);
    }
  }

  public removeControl(control: FormControl | InputControl): void {
    if (this.controls.contains(control) === true) {
      if (control instanceof AbstractControl) {
        control.removeParentForm(this);
        this.controls.remove(control);
      }
    } else {
      throw new Error(`A control with the name '${control.name}' does not exists.`);
    }
  }

  public getControls(): Array<FormControl | InputControl> {
    return <Array<FormControl | InputControl>>this.controls.get();
  }

  public getControl(name: string): FormControl | InputControl {
    return this.controls.find((control: FormControl | InputControl) => {
      return control.name === name;
    });
  }

  public setData(_data: Object) {
    console.log('FormControl.setData is currently not implemented.');
  }

  public getData(): Object {
    const data: Record<string, any> = {};
    this.controls.forEach((control: FormControl | InputControl) => {
      if (control instanceof FormControl) {
        data[control.name] = control.getData();
      } else if (control instanceof InputControl) {
        data[control.name] = control.value;
      } else {
        throw new Error(`The control is neither an instance of FormControl or InputControl.`);
      }
    });
    return data;
  }

  public setValidationHandler(validationHandler: ValidationHandler) {
    super.setValidationHandler(validationHandler);
  }
}

export class FormFactory {
  static createForm(name: string, json: Record<string, any>): FormControl {
    const form = new FormControl(name);
    for (const name in json) {
      if (json.hasOwnProperty(name)) {
        if (typeof json[name] === 'object' && json[name] !== null) {
          form.addConrol(FormFactory.createForm(name, json[name]));
        } else {
          const input = new InputControl(name);
          input.value = <unknown>json[name];
          form.addConrol(input);
        }
      }
    }
    return form;
  }
}
