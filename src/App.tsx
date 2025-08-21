import { useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import './App.css';
import { GetAllCrops, GetAllDataRecords } from './services/ApiHandlerService';
import type { RecordType } from './types/recordType';
import type { DataPieType } from './types/dataPieType';
import type { CropType } from './types/cropType';
import TitleSection from './components/TitleSection';

const getNameCrop = (list: CropType[], cropId: string) => {
  return list.find((crop) => crop.id == cropId)!.nombre;
};

function App() {
  const [allDataRecords, setAllDataRecords] = useState<RecordType[]>([]);

  const [allDataCrops, setAllDataCrops] = useState<CropType[]>([]);

  const [dataToPie, setDataToPie] = useState<DataPieType[]>([]);

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

  useEffect(() => {
    GetAllDataRecords().then((responseRecords) => {
      setAllDataRecords(responseRecords.data);
      GetAllCrops().then((responseCrops) => {
        setAllDataCrops(responseCrops.data);
        parseDataPie();
      });
    });
  });

  const options = {
    title: '',
    is3D: true,
  };
  return (
    <>
      <article className="">
        <TitleSection title="Cultivados en el Valle del Cauca" />
        <Chart
          chartType="PieChart"
          data={dataToPie.map((x) => [x.name, x.quantity])}
          options={options}
          width={'100%'}
          height={'400px'}
        />
      </article>
      <article>
        <TitleSection title="Rendimiento por cosecha" />
      </article>
    </>
  );
}

export default App;
