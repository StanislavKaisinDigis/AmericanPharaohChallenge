import React, { FC, useEffect, useMemo, useRef } from 'react';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import { Tab } from '../../components/Tab';
import { mockdata } from '../../api/mockData/mockdata';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface ImockDataItem {
  id: string;
  thumbnail: string;
  tee_time: string;
}
interface Iacc {
  [teaSlot: string]: ImockDataItem[];
}

export const Home: FC = () => {
  const carousel = useRef();
  const [value, setValue] = React.useState(0);
  useEffect(() => {
    const options = {
      duration: 300,
    };
    window.M.AutoInit();
    window.M.Carousel.init(carousel, options);
  }, [value]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getTeeSlot = (item: ImockDataItem) => {
    const teaSlotHours = item.tee_time.split(':')[0];
    const teaSlotMinutes = item.tee_time.split(':')[1];
    const teaSlotMinutesFloor = Math.floor(+teaSlotMinutes / 10) * 10;
    const teaSlot = [
      +teaSlotHours < 10 ? '0' + teaSlotHours : '' + teaSlotHours,
      teaSlotMinutesFloor < 10 ? '0' + teaSlotMinutesFloor : '' + teaSlotMinutesFloor,
    ].join(':');
    return teaSlot;
  };

  const { sorted, timeSlotsSortedByLast } = useMemo(() => {
    //process data: split into slots
    const sorted = mockdata.reduce((acc: Iacc, item: ImockDataItem) => {
      const teaSlot = getTeeSlot(item);
      if (!acc.hasOwnProperty(teaSlot)) {
        Object.defineProperty(acc, teaSlot, { value: [], enumerable: true });
      }
      acc[teaSlot].push(item);
      return acc;
    }, {});
    //process data: prepare for rendering
    const lastTeaSlot = getTeeSlot(mockdata[mockdata.length - 1]);
    const teeSlotsSortedByTime = Object.keys(sorted).sort();
    const timeSlotsSortedByLast = [
      ...teeSlotsSortedByTime.slice(teeSlotsSortedByTime.indexOf(lastTeaSlot)),
      ...teeSlotsSortedByTime.slice(0, teeSlotsSortedByTime.indexOf(lastTeaSlot)),
    ];

    return { sorted, teeSlotsSortedByTime, timeSlotsSortedByLast };
  }, [mockdata]);

  const currentTeeTimeSlot = timeSlotsSortedByLast[value];

  return (
    <div>
      home
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'inherit' }}>
          <TabsUnstyled defaultValue={0}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile="true"
              TabIndicatorProps={{
                style: {
                  display: 'none',
                },
              }}
            >
              {timeSlotsSortedByLast.length &&
                timeSlotsSortedByLast.map((item, index) => {
                  return (
                    <Tab {...a11yProps(index)} key={item}>
                      {item}
                    </Tab>
                  );
                })}
            </Tabs>
          </TabsUnstyled>
        </Box>
      </Box>
      <div className="carousel" ref={carousel}>
        {sorted[currentTeeTimeSlot].length &&
          sorted[currentTeeTimeSlot].reverse().map((item: ImockDataItem) => {
            return (
              <a
                className="carousel-item"
                href="#"
                key={item.id}
                style={{
                  border: '1px solid white',
                  borderRadius: '8px',
                }}
              >
                <img src={item.thumbnail} />
                <p>Tee time property: {item.tee_time}</p>
              </a>
            );
          })}
      </div>
    </div>
  );
};
