import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/react";

export default function DisplayProductDescription({description}) {
    const data = description
    const parseDescription = (desc)=>{
        if(!desc) return []

        try{
            return desc.split(';')
            .map(item => item.trim())
            .filter(item => item.includes(":"))
            .map(item =>{
                const [param, value] = item.split(":").map(part => part.trim());
                 
                return {param, value}
            })
          
        }
        catch(error){
        console.error("Błąd parsowania danych:", error);
        return [];
        }

    }

const displayData = parseDescription(data);
  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn className="text-primary text-sm">Parametr</TableColumn>
        <TableColumn className="text-primary text-sm">Wartość</TableColumn>
      </TableHeader>

      <TableBody>
        {displayData.map((item, index)=>(
            <TableRow key={index} className={index % 2 === 0 ?  "bg-grey-50" : "bg-accent"}>
                <TableCell className="text-sm mt-[.5rem]">{item.param}</TableCell>
                <TableCell className="text-sm ">{item.value}</TableCell>
            </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
