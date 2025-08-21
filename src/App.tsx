import { useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import { IoMdAdd } from 'react-icons/io';
import { toast, ToastContainer } from 'react-toastify';
import './App.css';
import DialogAddRecord from './components/DialogAddRecord';
import TitleSection from './components/TitleSection';
import { GetAllCrops, GetAllDataRecords, SaveRecord } from './services/ApiHandlerService';
import type { CropType } from './types/cropType';
import type { DataPieType } from './types/dataPieType';
import type { DataTableRecordsType } from './types/dataTableRecords';
import type { RecordToSaveType } from './types/recordToSaveType';
import type { RecordType } from './types/recordType';

const getNameCrop = (list: CropType[], cropId: string) => {
  return list.find((crop) => crop.id == cropId)!.nombre;
};

function App() {
  const [allDataRecords, setAllDataRecords] = useState<RecordType[]>([]);

  const [allDataCrops, setAllDataCrops] = useState<CropType[]>([]);

  const [dataToPie, setDataToPie] = useState<DataPieType[]>([]);

  const [dataToTableProduct, setDataToTableProduct] = useState<DataTableRecordsType[]>([]);

  const [showModalAddProduct, setShowModalAddProduct] = useState(false);

  const parseDataPie = () => {
    const joinCrop: DataPieType[] = [];
    joinCrop.push({ id: 'Cultivos', name: 'Slices', quantity: 'Slices' });
    allDataRecords.forEach((crop) => {
      if (!joinCrop.find((x) => x.id === crop.cultivo)) {
        joinCrop.push({
          id: crop.cultivo,
          name: getNameCrop(allDataCrops, crop.cultivo),
          quantity: 1,
        });
      } else {
        joinCrop.forEach((x, i) => {
          if (x.id === crop.cultivo) {
            let tmp = parseInt(joinCrop[i].quantity.toString());
            tmp++;
            joinCrop[i].quantity = tmp;
          }
        });
      }
    });

    setDataToPie(joinCrop);
  };

  const parseDataTableProduct = () => {
    const joinCrop: DataTableRecordsType[] = [];
    joinCrop.push({
      cultivo: 'Cultivos',
      nombre_cultivo: 'Cultivos',
      rendimiento_toneladas: 'Rendimiento toneladas',
    });
    allDataRecords.forEach((crop) => {
      if (!joinCrop.find((x) => x.cultivo === crop.cultivo)) {
        joinCrop.push({
          cultivo: crop.cultivo,
          nombre_cultivo: getNameCrop(allDataCrops, crop.cultivo),
          rendimiento_toneladas: crop.rendimiento_toneladas,
        });
      } else {
        joinCrop.forEach((x, i) => {
          if (x.cultivo === crop.cultivo) {
            let tmp = parseInt(joinCrop[i].rendimiento_toneladas.toString());
            tmp += crop.rendimiento_toneladas;
            joinCrop[i].rendimiento_toneladas = tmp;
          }
        });
      }
    });
    setDataToTableProduct(joinCrop);
  };

  useEffect(() => {
    GetAllDataRecords().then((responseRecords) => {
      setAllDataRecords(responseRecords.data);
      GetAllCrops().then((responseCrops) => {
        setAllDataCrops(responseCrops.data);
        parseDataPie();
        parseDataTableProduct();
      });
    });
  });

  const addRecord = (newData: RecordToSaveType) => {
    SaveRecord(newData).then(() => {
      toast.success('Registro guardado');
      setShowModalAddProduct(false);

      GetAllDataRecords().then((responseRecords) => {
        setAllDataRecords(responseRecords.data);
        parseDataPie();
        parseDataTableProduct();
      });
    });
  };

  return (
    <>
      <nav className="flex justify-between px-2 py-4 bg-black/90 m-0 text-white">
        <div className="text-3xl font-bold ">Automatiza el agro</div>
        <button
          className="flex justify-center items-center bg-[rgba(var(--cl-primary),1)] text-black rounded-md p-2  gap-2"
          onClick={() => setShowModalAddProduct(true)}
        >
          <span>Agregar</span>
          <IoMdAdd />
        </button>
      </nav>
      <article className="bg-black/90 rounded-b-[4rem]">
        <TitleSection className="text-white" title="Cultivos en el Valle del Cauca" />
        <Chart
          chartType="PieChart"
          data={dataToPie.map((x) => [x.name, x.quantity])}
          options={{
            title: '',
            is3D: true,
            backgroundColor: 'transparent',
            pieSliceTextStyle: {
              color: 'white',
            },
            legend: {
              textStyle: {
                color: 'white',
              },
            },
          }}
          width={'100%'}
          height={'400px'}
        />
      </article>
      <article className="mt-8">
        <TitleSection title="Rendimiento por cosecha" />
        <Chart
          chartType="Table"
          data={dataToTableProduct.map((x) => [x.nombre_cultivo, x.rendimiento_toneladas])}
          options={{
            // @ts-expect-error "Unknown type"
            width: '100%',
            // @ts-expect-error "Unknown type"
            height: '100%',
            showRowNumber: true,
            allowHtml: true,
            cssClassNames: { tableCell: 'cell_table' },
          }}
        />
      </article>
      {showModalAddProduct && (
        <DialogAddRecord
          cancelHandler={() => setShowModalAddProduct(false)}
          okHandler={addRecord}
          listCrops={allDataCrops}
        />
      )}
      <ToastContainer />
    </>
  );
}

export default App;
