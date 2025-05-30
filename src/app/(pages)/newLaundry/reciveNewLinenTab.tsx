"use client";

import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DataTable from "./datatable";
import { useState } from "react";

const options = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Grapes", value: "grapes" },
    { label: "Orange", value: "orange" },
    { label: "Mango", value: "mango" },
];


export default function ReciveNewLinenTab() {
    const t = useTranslations('NewLaundry');
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<string | null>(null)

    return (
        <>
            <TabsContent value="ReciveNewLinenTab">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('tab1')}</CardTitle>
                        {/* <CardDescription>
                            Make changes to your account here. Click save when you're done.
                        </CardDescription> */}
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div className="p-0">
                                    <Label htmlFor="name">{t('contentsTab1.hospital')}</Label>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-full justify-between my-1">
                                                {selected ? options.find(opt => opt.value === selected)?.label : "Select fruit"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <Command>
                                                <CommandInput placeholder="Search fruits..." />
                                                <CommandList>
                                                    {options.map((option) => (
                                                        <CommandItem
                                                            key={option.value}
                                                            value={option.label}
                                                            onSelect={() => {
                                                                setSelected(option.value)
                                                                setOpen(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn("mr-2 h-4 w-4", selected === option.value ? "opacity-100" : "opacity-0")}
                                                            />
                                                            {option.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="p-1">
                                    col2
                                </div>
                            </div>


                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" defaultValue="@peduarte" />
                        </div>


                        <hr className="my-2" />

                        {/* ===================== DataTable ===================== */}
                        <DataTable />


                    </CardContent>
                    <CardFooter>
                        <Button>Save changes</Button>
                    </CardFooter>
                </Card>
            </TabsContent>

        </>
    )

}