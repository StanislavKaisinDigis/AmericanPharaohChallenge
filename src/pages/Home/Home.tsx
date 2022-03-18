import React, { FC, useEffect, useRef } from 'react';

import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';

import { mockdata } from '../../api/mockData/mockdata';

const Tab = styled(TabUnstyled)`
  font-family: IBM Plex Sans, sans-serif;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: #0b4c8c;
  width: 100%;
  padding: 12px 16px;
  margin: 6px 6px;
  border: none;
  border-radius: 5px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: #f4b93b;
  }

  &:focus {
    color: #fff;
    border-radius: 3px;
    // outline: 2px solid #F4B93B;
    outline-offset: 2px;
    background-color: #f4b93b;
  }

  &.${tabUnstyledClasses.selected} {
    background-color: #f4b93b;
    color: white;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabPanel = styled(TabPanelUnstyled)`
  width: 100%;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
`;

const TabsList = styled(TabsListUnstyled)`
  min-width: 320px;
  background-color: #0b4c8c;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
`;

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

  //process data: split into slots
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
          sorted[currentTeeTimeSlot].reverse().map((item: ImockDataItem, index, array) => {
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
