import React from "react";
import list_white from '../icons/list_white.svg';
import list_black from '../icons/list_black.svg';
import table_white from '../icons/table_white.svg';
import table_black from '../icons/table_black.svg';
import kanban_white from '../icons/kanban_white.svg';
import kanban_black from '../icons/kanban_black.svg';
import timeline_white from '../icons/timeline_white.svg';
import timeline_black from '../icons/timeline_black.svg';
import org_white from '../icons/org_white.svg';
import org_black from '../icons/org_black.svg';

export interface NavBarProps {
    handleNavItemClick: (viewName: string) => void;
    view: string;
}

export const NavBar = ({
    ...props
}: NavBarProps) => {

    const NavItem = (view: string, white_svg: any, black_svg: any) => {
        return (
            <button className={`h-[50px] flex p-2 rounded-xl hover:bg-cerulean focus:ring-offset-4 focus:ring-yinmn-blue focus:ring
                ${props.view === view ? 'bg-yinmn-blue text-white' : ''} `} onClick={() => props.handleNavItemClick(view)}>
                <div className='w-[34px] h-full flex justify-center items-center'>
                    {props.view === view ? <img src={white_svg} alt={`${view} Icon`} /> : <img src={black_svg} alt={`${view} Icon`} />}
                </div>
                <div className='h-full flex-1 flex ml-3 items-center text-1xl'>{view} View</div>
            </button>
        )
    };

    return (
        <div className='w-[300px] h-full flex flex-col'>
        
            <div className="h-[50px] shrink-0 flex p-2">
                <img className='ml-2 w-[34px] rounded-full' src="https://www.hartz.com/wp-content/uploads/2022/04/small-dog-owners-1.jpg" alt="Doggo" />
                <div className='flex-1 flex flex-col ml-2'>
                    <div className='h-1/2 text-sm font-bold text-gray-500'>Name</div>
                    <div className='h-1/2 text-sm text-gray-500'>Organization</div>
               </div>
            </div>

            <div className='bg-white h-full flex-col flex gap-4 rounded-xl p-2'>
                {NavItem("List", list_white, list_black)}
                {NavItem("Table", table_white, table_black)}
                {NavItem("Kanban", kanban_white, kanban_black)}
                {NavItem("Timeline", timeline_white, timeline_black)}

                <hr/>

                {NavItem("Organization", org_white, org_black)}
            </div>
        </div>
    );
};

export default NavBar;


