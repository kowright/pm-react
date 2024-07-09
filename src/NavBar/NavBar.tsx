import React from "react";

export interface NavBarProps {
    handleNavItemClick: (viewName:string) => void;
}

export const NavBar = ({

    ...props
}: NavBarProps) => {

    return (
      
        <div className='w-[300px] h-full flex flex-col bg-black'>
        
            <div className="bg-yellow-300 h-[50px] shrink-0 flex p-2">
                <img className='bg-yellow-500 ml-2 w-[34px] rounded-full' src="https://www.hartz.com/wp-content/uploads/2022/04/small-dog-owners-1.jpg" alt="Doggo" />
                <div className='bg-yellow-700 flex-1 flex flex-col ml-2'>
                    <div className='bg-purple-100 h-1/2 text-xs'>Name</div>
                    <div className='bg-purple-300 h-1/2 text-xs'>Organization</div>
               </div>
            </div>

            <div className='bg-white h-full flex-col flex gap-4 p-2'>
                <button className='h-[50px] bg-green-100 flex p-2' onClick={() => props.handleNavItemClick("List")}>
                    <div className='bg-red-100 w-[34px] h-full flex justify-center items-center'>X</div>
                    <div className='bg-purple-100 h-full flex-1 flex ml-3 items-center'>List View</div>
                </button>
                <button className='h-[50px] bg-green-100 flex p-2' onClick={() => props.handleNavItemClick("Table")}>
                    <div className='bg-red-100 w-[34px] h-full flex justify-center items-center'>X</div>
                    <div className='bg-purple-100 h-full flex-1 flex ml-3 items-center'>Table View</div>
                </button>
                <button className='h-[50px] bg-green-100 flex p-2' onClick={() => props.handleNavItemClick("Kanban")}>
                    <div className='bg-red-100 w-[34px] h-full flex justify-center items-center'>X</div>
                    <div className='bg-purple-100 h-full flex-1 flex ml-3 items-center'>Kanban View</div>
                </button>
                <button className='h-[50px] bg-green-100 flex p-2' onClick={() => props.handleNavItemClick("Timeline")}>
                    <div className='bg-red-100 w-[34px] h-full flex justify-center items-center'>X</div>
                    <div className='bg-purple-100 h-full flex-1 flex ml-3 items-center'>Timeline View</div>
                </button>
                <hr/>

                <button className='h-[50px] bg-green-100 flex p-2' onClick={() => props.handleNavItemClick("Organization")}>
                    <div className='bg-red-100 w-[34px] h-full flex justify-center items-center'>X</div>
                    <div className='bg-purple-100 h-full flex-1 flex ml-3 items-center'>Organization Settings</div>
                </button>

            </div>


        </div>



    );
};
export default NavBar;


