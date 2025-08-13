'use client';

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconChevronDown, IconSearch, IconReload, IconX } from "@tabler/icons-react";

interface Option {
    id: number;
    value: string;
    label: string;
}

interface PaginatedSelectProps {
    value: string;
    placeholder?: string;
    disabled?: boolean;
    options: Option[];
    loading?: boolean;
    hasMore?: boolean;
    onValueChange: (value: string) => void;
    onSearch: (keyword: string) => void;
    onLoadMore: () => void;
    className?: string;
    showClearButton?: boolean; // เพิ่ม prop สำหรับควบคุมการแสดงปุ่ม clear
    clearButtonText?: string; // เพิ่ม prop สำหรับข้อความปุ่ม clear
}

export function PaginatedSelect({
    value,
    placeholder = "Select an option",
    disabled = false,
    options,
    loading = false,
    hasMore = false,
    onValueChange,
    onSearch,
    onLoadMore,
    className = "",
    showClearButton = true,
    clearButtonText = "ล้างการเลือก"
}: PaginatedSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(option => option.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [searchKeyword]);

    useEffect(() => {
        if (isOpen && listRef.current) {
            const handleScroll = () => {
                const { scrollTop, scrollHeight, clientHeight } = listRef.current!;
                if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loading) {
                    onLoadMore();
                }
            };

            listRef.current.addEventListener('scroll', handleScroll);
            return () => listRef.current?.removeEventListener('scroll', handleScroll);
        }
    }, [isOpen, hasMore, loading, onLoadMore]);

    const handleSearch = () => {
        setSearchKeyword(searchInput);
        onSearch(searchInput);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        } else if (e.key === 'Escape') {
            handleClose();
        }
    };

    const handleOptionSelect = (optionValue: string) => {
        onValueChange(optionValue);
        setIsOpen(false);
        setSearchInput('');
        setSearchKeyword('');
    };

    const handleClearSelection = () => {
        onValueChange('');
        setIsOpen(false);
        setSearchInput('');
        setSearchKeyword('');
    };

    const handleClose = () => {
        setIsOpen(false);
        setSearchInput('');
        setSearchKeyword('');
        // Reset search when closing dropdown
        if (searchKeyword) {
            onSearch('');
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div className="flex gap-1">
                <Button
                    type="button"
                    variant="outline"
                    className={`flex-1 justify-between ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                >
                    <span className="truncate text-left flex-1">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <IconChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </Button>

                {/* Clear Button - แสดงเมื่อมีการเลือกค่าแล้ว */}
                {value && showClearButton && !disabled && (
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 text-gray-500 hover:bg-red-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClearSelection();
                        }}
                        title={clearButtonText}
                    >
                        <IconX className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-w-full">
                    {/* Search Header */}
                    <div className="p-3 border-b border-gray-200">
                        <div className="flex gap-2">
                            <Input
                                placeholder="ค้นหา..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="flex-1"
                                autoFocus
                                disabled={loading}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                {loading ? (
                                    <IconReload className="w-4 h-4 animate-spin" />
                                ) : (
                                    <IconSearch className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Options List */}
                    <div
                        ref={listRef}
                        className="max-h-60 overflow-y-auto"
                    >
                        {/* Clear Selection Option */}
                        {value && showClearButton && (
                            <div
                                className="px-3 py-2 hover:bg-red-50 cursor-pointer text-red-600 border-b border-gray-100 flex items-center gap-2"
                                onClick={handleClearSelection}
                            >
                                <IconX className="w-4 h-4" />
                                {clearButtonText}
                            </div>
                        )}

                        {options.length === 0 && !loading && (
                            <div className="px-3 py-2 text-gray-500 text-center">
                                ไม่พบข้อมูล
                            </div>
                        )}

                        {options.map((option, index) => (
                            <div
                                key={`${option.id}-${index}`}
                                className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${value === option.value ? 'bg-blue-50 text-blue-600' : ''
                                    }`}
                                onClick={() => handleOptionSelect(option.value)}
                            >
                                {option.label}
                            </div>
                        ))}

                        {/* Loading More Indicator */}
                        {loading && (
                            <div className="px-3 py-2 text-center text-gray-500">
                                <div className="flex items-center justify-center gap-2">
                                    <IconReload className="w-4 h-4 animate-spin" />
                                    กำลังโหลด...
                                </div>
                            </div>
                        )}

                        {/* Load More Button */}
                        {hasMore && !loading && (
                            <div className="px-3 py-2 border-t border-gray-100">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="w-full"
                                    onClick={onLoadMore}
                                >
                                    โหลดเพิ่มเติม...
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
