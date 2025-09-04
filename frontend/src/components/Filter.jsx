import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";
import { useCategory } from "../Context/CategoyContext";

function Filter() {
    const { filter, setFilter } = useCategory();
  return (
    <Dropdown  classNames={{
        base: "before:bg-default-200", // change arrow background
        content:
          "py-1 px-1 border border-default-200 bg-linear-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
      }}>
      <DropdownTrigger>
        <Button className="mt-[1.5rem] shadow-small rounded-medium py-[1.5rem] max-w-[500px] min-w-[250px] text-center  bg-primary text-[rgb(255,255,255)] h-8">Sortuj</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Action event example" onAction={(key) => setFilter(key)}>
        <DropdownItem key="alphabetical">Alfabetycznie</DropdownItem>
        <DropdownItem key="newest">Od najnowszych</DropdownItem>
        <DropdownItem key="ratingDesc">Najwyższa ocena</DropdownItem>
        <DropdownItem key="ratingAsc">Najniższa ocena</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
export default Filter