import { useRef } from 'react';
import { toast } from 'react-toastify';
import type { CropType } from '../types/cropType';
import type { RecordToSaveType } from '../types/recordToSaveType';

type TProps = {
  listCrops: CropType[];
  cancelHandler: () => void;
  okHandler: (newData: RecordToSaveType) => void;
};

export default function DialogAddRecord({ cancelHandler, okHandler, listCrops }: TProps) {
  const formRef = useRef(null);
  const validateForm = () => {
    const form = formRef.current as unknown as HTMLFormElement;
    const formData = new FormData(form);

    if (form.checkValidity() === false || formData.get('cultivo') === '0') {
      toast.error('Formulario invalido');
      return;
    }

    const objSend: RecordToSaveType = {
      id_finca: formData.get('id_finca')!.toString(),
      cultivo: formData.get('cultivo')!.toString(),
      rendimiento_toneladas: formData.get('rendimiento_toneladas')!.toString(),
      fecha_siembra: formData.get('fecha_siembra')!.toString(),
    };

    okHandler(objSend);
  };

  return (
    <div className="modal">
      <div className="modal_body">
        <h3 className="modal_body-title font-bold">Agregar Registro</h3>
        <div className="modal_body-content">
          <form id="form_add" ref={formRef}>
            <div className="form-group">
              <label htmlFor="id_finca">Id Finca</label>
              <input
                type="number"
                placeholder="Ingrese el id de la finca"
                id="id_finca"
                name="id_finca"
                required
              />
            </div>

            <select name="cultivo" id="cultivo">
              <option value="0">Seleccione un cultivo</option>
              {listCrops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.nombre}
                </option>
              ))}
            </select>

            <div className="form-group">
              <label htmlFor="fecha_siembra">Fecha siembra</label>
              <input type="date" id="fecha_siembra" name="fecha_siembra" required />
            </div>

            <div className="form-group">
              <label htmlFor="rendimiento_toneladas">Rendimiento (Toneladas)</label>
              <input
                type="text"
                id="rendimiento_toneladas"
                name="rendimiento_toneladas"
                placeholder="Ingrese el rendimiento en toneladas"
                required
              />
            </div>
          </form>
        </div>
        <div className="modal_body-actions">
          <button className="modal_body-actions-button-ok" onClick={validateForm}>
            Agregar
          </button>
          <button className="modal_body-actions-button-cancel" onClick={cancelHandler}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
