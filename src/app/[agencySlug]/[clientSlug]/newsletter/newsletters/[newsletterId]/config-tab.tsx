"use client"

import { AudienceDAO } from "@/services/audience-services";
import { DomainDAO } from "@/services/domain-services";
import { NewsletterDAO } from "@/services/newsletter-services";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { setAudienceAction, setEmailFromAction, setReplyToAction } from "../newsletter-actions";
import { Button } from "@/components/ui/button";
import { NewsletterStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader, Save } from "lucide-react";

type Props = {
    newsletter: NewsletterDAO
    domains: DomainDAO[]
    audiences: AudienceDAO[]
}

export default function ConfigTab({ newsletter, domains, audiences }: Props) {
    const [loading, setLoading] = useState(false);
    const [isEditingFrom, setIsEditingFrom] = useState(false);
    const [fromLocalValue, setFromLocalValue] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("");
    const [isEditingReplyTo, setIsEditingReplyTo] = useState(false);
    const [replyToValue, setReplyToValue] = useState(newsletter.replyTo || "");
    const { toast } = useToast();
    
    const isEditable = newsletter.status === NewsletterStatus.DRAFT;
    
    // Separar el email en usuario y dominio
    const currentEmail = newsletter.emailFrom || "";
    const [emailUser, emailDomain] = currentEmail.split("@");

    // Inicializar el dominio seleccionado cuando se entra en modo edición
    useEffect(() => {
        if (isEditingFrom) {
            setSelectedDomain(emailDomain || domains[0]?.name || "");
        }
    }, [isEditingFrom, emailDomain, domains]);

    const validateEmail = (email: string): boolean => {
        if (!email.trim()) return true; // Permitimos valor vacío
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const handleFromEdit = async (value: string) => {
        setLoading(true);
        if (!isEditable) return;
        if (!value.trim()) {
            await setEmailFromAction(newsletter.id, "");
            setIsEditingFrom(false);
            setLoading(false);
            return;
        }
        const domain = domains.length === 1 ? domains[0].name : selectedDomain;
        const newEmail = `${value}@${domain}`;
        await setEmailFromAction(newsletter.id, newEmail);
        setIsEditingFrom(false);
        setLoading(false);
    };

    const handleDomainChange = (domain: string) => {
        setSelectedDomain(domain);
    };

    const handleReplyToChange = async (value: string) => {
        if (!isEditable) return;
        
        if (!validateEmail(value)) {
            toast({
                variant: "destructive",
                title: "Formato de email inválido",
                description: "Por favor ingresa un email válido o déjalo vacío"
            });
            return;
        }

        await setReplyToAction(newsletter.id, value);
        setIsEditingReplyTo(false);
    };

    const handleAudienceChange = async (audienceId: string) => {
        if (!isEditable) return;
        await setAudienceAction(newsletter.id, audienceId);
    };

    return (
        <div className="flex flex-col gap-6 p-1 md:p-4 xl:p-8 w-full max-w-xl mx-auto bg-background rounded-xl border mt-10">
            <div className="flex items-center justify-between">
                <p className="text-xl font-bold line-clamp-1">Asunto: {newsletter.subject}</p>
                <Badge>{newsletter.status}</Badge>
            </div>

            
            <div className="flex items-center">
                <label className="font-medium w-20">From:</label>
                {isEditable ? (
                    isEditingFrom ? (
                        <div className="flex items-center gap-2">
                            <Input
                                autoFocus
                                value={fromLocalValue}
                                onChange={(e) => setFromLocalValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleFromEdit(fromLocalValue);
                                    }
                                    if (e.key === "Escape") {
                                        setIsEditingFrom(false);
                                    }
                                }}
                                className="flex-1"
                            />
                            <span>@</span>
                            {domains.length > 1 ? (
                                <div className="flex gap-2 items-center">
                                    <Select 
                                        value={selectedDomain} 
                                        onValueChange={handleDomainChange}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Selecciona un dominio" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {domains.map((domain) => (
                                                <SelectItem key={domain.id} value={domain.name}>
                                                    {domain.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button 
                                        onClick={() => handleFromEdit(fromLocalValue)}
                                        size="sm"
                                        disabled={loading}
                                        className="gap-2"
                                    >
                                        {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        Guardar
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-2 items-center">
                                    <span className="p-2 border rounded-md bg-gray-50 w-[180px] text-center">
                                        {domains[0]?.name || ""}
                                    </span>
                                    <Button 
                                        onClick={() => handleFromEdit(fromLocalValue)}
                                        size="sm"
                                        disabled={loading}
                                        className="gap-2"
                                    >
                                        {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        Guardar
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setFromLocalValue(emailUser || "");
                                setIsEditingFrom(true);
                            }}
                            className="font-bold text-lg"
                        >
                            {currentEmail || "configurar"}
                        </Button>
                    )
                ) : (
                    <p className="text-lg ml-2">{currentEmail}</p>
                )}
            </div>

            <div className="flex items-center">
                <label className="font-medium w-20">Reply-To:</label>
                {isEditable ? (
                    isEditingReplyTo ? (
                        <Input
                            type="email"
                            autoFocus
                            value={replyToValue}
                            onChange={(e) => setReplyToValue(e.target.value)}
                            onBlur={() => handleReplyToChange(replyToValue)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleReplyToChange(replyToValue);
                                }
                            }}
                            placeholder="email@dominio.com"
                        />
                    ) : (
                        <Button
                            variant="ghost"
                            onClick={() => setIsEditingReplyTo(true)}
                            className="font-bold text-lg"
                        >
                            {newsletter.replyTo || "configurar"}
                        </Button>
                    )
                ) : (
                    <p className="text-lg ml-2">{newsletter.replyTo || "sin-valor"}</p>
                )}
            </div>

            <div className="flex items-center gap-2">
                <label className="font-medium w-20">To:</label>
                <div className="flex-1">
                    {isEditable ? (
                        <Select
                            value={newsletter.audienceId || ""}
                            onValueChange={handleAudienceChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una audiencia" />
                            </SelectTrigger>
                            <SelectContent>
                                {audiences.map((audience) => (
                                    <SelectItem key={audience.id} value={audience.id}>
                                        {audience.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <p className="text-lg">
                            {audiences.find(a => a.id === newsletter.audienceId)?.name || "Sin audiencia seleccionada"}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}