import { Dropdown, Space } from 'antd';
import React from "react";

const Menu=()=>  {
    const items = [
        {
            label:(
                <div className="">
							<h3>Online Status</h3>
                </div>
            )
        },
		{
		  label: (
			<a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
			  1st menu item
			</a>
		  ),
		  key: '0',
		},
	
	  ];
    return(
        <Dropdown menu={{
            items,
          }}>
                                  <a onClick={(e) => e.preventDefault()}>
                                      <Space>
                                          Hover me
                                      </Space>
                                  </a>
                              </Dropdown>
    )
}

export {Menu}