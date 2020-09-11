import { DI } from '@leanup/lib/helpers/injector';

import { MeasuredSerieModel } from '../../../models/measured-series.model';
import { MeasurementService } from '../../../services/measurements/service';
import { RouterService } from '../../../services/router/service';
import { EditorForm } from '../editor/editor.form';

export class CreateSerieController {
  private readonly measurementService: MeasurementService = DI.get('MeasurementService') as MeasurementService;
  public editorForm: EditorForm = new EditorForm('new');

  public onSubmit(): void {
    this.measurementService.addSerie(
      new MeasuredSerieModel(this.editorForm.getInput('title').value, this.editorForm.getInput('unit').value)
    );
    this.measurementService.store();
    this.editorForm = new EditorForm('new');
    this.onCancel();
  }

  public onCancel(): void {
    RouterService.navigate('series');
  }
}
