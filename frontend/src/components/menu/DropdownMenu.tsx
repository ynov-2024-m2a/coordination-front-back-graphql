import { SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: 'Submenu',
    key: 'SubMenu',
    icon: <SettingOutlined />,
    children: [
      {
        label: 'Ton pere',
        key: 'Ton pere',
      },
      {
        label: 'Ta mere',
        key: 'Ta mere',
      },
    ],
  },
];

const DropdownMenu = () => {
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = e => {
    setCurrent(e.key);
  };

    return (
        <>
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
        </>
    );
}

export default DropdownMenu;