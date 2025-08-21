import { useEffect, useState } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import Chart from 'react-google-charts';
import { FaGithub } from 'react-icons/fa';
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
      cantidad_cultivos: 'Cantidad cultivos',
      rendimiento_toneladas: 'Rendimiento toneladas',
    });
    allDataRecords.forEach((crop) => {
      if (!joinCrop.find((x) => x.cultivo === crop.cultivo)) {
        joinCrop.push({
          cultivo: crop.cultivo,
          nombre_cultivo: getNameCrop(allDataCrops, crop.cultivo),
          cantidad_cultivos: 1,
          rendimiento_toneladas: parseFloat(crop.rendimiento_toneladas.toString()),
        });
      } else {
        joinCrop.forEach((x, i) => {
          if (x.cultivo === crop.cultivo) {
            let tmp = parseInt(joinCrop[i].rendimiento_toneladas.toString());
            tmp += parseFloat(crop.rendimiento_toneladas.toString());
            joinCrop[i].rendimiento_toneladas = tmp;

            let tmpCultivo = parseInt(joinCrop[i].cantidad_cultivos.toString());
            tmpCultivo++;
            joinCrop[i].cantidad_cultivos = tmpCultivo;
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
        <div className="text-2xl md:text-3xl font-bold ">Automatiza el agro</div>
        <button
          className="flex justify-center items-center bg-[rgba(var(--cl-primary),1)] text-black rounded-md p-2  gap-2"
          onClick={() => setShowModalAddProduct(true)}
        >
          <span>Agregar</span>
          <IoMdAdd />
        </button>
      </nav>
      <article className=" rounded-b-[4rem] relative hero_one">
        <TitleSection className="text-white" title={`Cultivos en el Valle del Cauca`} />
        <span className="text-white text-sm opacity-40">Cantidad de Registros {allDataRecords.length}</span>
        <BrowserView>
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
                alignment: 'center',
                position: 'labeled',
                maxLines: 2,
              },
            }}
            width={'100%'}
            height={'400px'}
          />
        </BrowserView>
        <MobileView>
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
                alignment: 'center',
                position: 'right',
                maxLines: 2,
              },
            }}
            width={'100%'}
            height={'400px'}
          />
        </MobileView>
      </article>
      <article className="mt-8">
        <TitleSection title="Rendimiento por cosecha" />
        <Chart
          chartType="Table"
          data={dataToTableProduct.map((x) => [
            x.nombre_cultivo,
            x.cantidad_cultivos,
            x.rendimiento_toneladas,
          ])}
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
      <footer className="mt-12 bg-black/90 text-white px-4 py-8 flex flex-col gap-4 justify-center items-center">
        <span className="opacity-70 text-sm flex gap-2">
          © 2025
          <a href="http://leonardohenao.com" target="_blank" rel="noopener noreferrer">
            Leonardo Henao
          </a>
          -
          <a href="http://instagram.com/isabel.agfi" target="_blank" rel="noopener noreferrer">
            Isabel Agudelo
          </a>
          -
          <a href="https://www.facebook.com/share/17FernSMgv/" target="_blank" rel="noopener noreferrer">
            Valeria Valencia
          </a>
        </span>
        <span>Agricultura Digital con Propósito</span>
        <ul>
          <li>
            <a
              href="https://github.com/leonardo-henao/hackathon_automatiza_agro"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>
          </li>
        </ul>
      </footer>
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
