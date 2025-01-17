"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import ZoomControls  from '@/components/custom/bpmn-visualization/zoomControlers';
import Pagination from "@/components/custom/pagination";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Toggle } from "@/components/ui/toggle"

import {
    CirclePlusIcon,
    WorkflowIcon,
    FileDownIcon,
    LockIcon,
    LockOpenIcon,
    Trash2Icon
} from "lucide-react";

import type { FitOptions } from 'bpmn-visualization';
import type { Workflow, Workflows } from '@/types/workflow';
import { BpmnVisualization, FitType } from 'bpmn-visualization';


/** @internal */
declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- Since we are overriding an existing interface in the global scope, it is not possible to convert it to a type.
  interface Window {
    mxForceIncludes: boolean;
    mxLoadResources: boolean;
    mxLoadStylesheets: boolean;
    mxResourceExtension: string;
  }
}

export default function Page() {
  const { data: session, status } = useSession();
  const [workflows, setWorkflows] = useState([] as Workflows);
  const [overflowMessage, setOverflowMessage] = useState(false);
  const [bpmnVisualization, setBpmnVisualization] = useState<BpmnVisualization>();
  const [fitOptions, setFitOptions] = useState<FitOptions>();
  const [showControls, setShowControls] = useState(false);
  const [page, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

// Item component that manages its own toggle state
const ToogleWorkflowItem = ({ workflow }: {workflow:Workflow}) => {
  const [isToggled, setIsToggled] = useState(workflow.exclusive);
  return (
    <Toggle
    className='mr-2'  
    disabled={(session&&session?.user.role === 'user')? true : false} 
    defaultPressed={workflow.exclusive} 
    onPressedChange={(pressed) => {
      console.log('pressed', pressed);
      setIsToggled(pressed);
      fetch("/api/workflows/mine", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: workflow.id, exclusive: pressed }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });

     }}                    
    >
   {isToggled?(<LockIcon />):(<LockOpenIcon />)}
</Toggle>
  );
};

useEffect(() => {
  //fetch the workflows
  fetch("/api/workflows/mine/count")
    .then((res) => res.json())
    .then((data) => {
      setTotalPages(data.totalPages);
    });
},[]);

useEffect(() => {
    //fetch the workflows of the user from api /api/workflows
    fetch("/api/workflows/mine?page=" + page)
      .then((res) => res.json())
      .then((data) => {
        setWorkflows(data.workflows);
      });
  },[page]);

  const updateWorkflow = (bpmnxml: string, index: number) => {
    "use client";   
    setShowControls(false);
    //ensure that we are on browser and window exists
    if (typeof window === 'undefined') {
              return;
    }
    setTimeout(async () => {
       "use client";
      
      //if xml is empty, return
      if (!bpmnxml) {
        console.log('xml is empty');
        return;
      }
      //if xmn is not a valid bpmn2 file, return
      if (bpmnxml.indexOf("definitions") === -1) {
        return;
      }
      const bpmnContainer = document.getElementById('bpmn-container-' + index);
      if (bpmnContainer) {
        // clear the container
        //detect if bpmnContainer have an svg element
        let svg = bpmnContainer.getElementsByTagName('svg');
        if (svg.length > 0) {
          svg[0].remove();
        }
        //bpmnContainer.innerHTML = '';//just in case
       
        if (typeof window !== 'undefined') {
        // load the new diagram
        const local_bpmnVisualization = new BpmnVisualization({
          container: 'bpmn-container-' + index, 
          navigation: {   enabled: true }
        });
        const local_fitOptions: FitOptions = { type: FitType.Center, margin: 20 };
        local_bpmnVisualization.load(bpmnxml, { fit: local_fitOptions });
        
        if (bpmnContainer.clientHeight < bpmnContainer.scrollHeight || bpmnContainer.clientWidth < bpmnContainer.scrollWidth) {
          setOverflowMessage(true);
        }
        setBpmnVisualization(local_bpmnVisualization);
        setFitOptions(local_fitOptions);
        setShowControls(true);
      }

      } else {
        console.log('bpmnContainer not found');
        return;
      }
    }, 1000);
  }

  const previewBPMN = (bpmnxml: string, index: number) => {

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={() => {
            updateWorkflow(bpmnxml, index);
          }
          } variant="default" className='mb-10'><WorkflowIcon /><span className='hidden lg:inline-block'>view</span></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:max-w-[95%] md:w-full">
          <DialogHeader>
            <DialogTitle>preview BPMN</DialogTitle>
            <DialogDescription>
              preview the BPMN diagram of the workflow.
            </DialogDescription>
          </DialogHeader>
          <div id={"bpmn-container-" + index} className="h-96 container overflow-hidden border rounded-md bg-slate-50">
          {showControls&&<ZoomControls bpmnVisualization={bpmnVisualization} fitOptions={fitOptions} />}
          </div>
          {overflowMessage && <span className="mt-10 block text-xs font-light text-pretty text-gray-700 dark:text-white">
            The diagram is too large and does not fit within the container.
            Zoom in/out by holding the CTRL key and rolling the mouse wheel.
            Drag/Pan the diagram by holding the mouse left button and moving the mouse to move the diagram within the container.
            On touch screen (mobile/tablet), use two fingers to zoom or pan the diagram.
          </span>
          }

         <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className='p-8'>
      {session && <h1> Welcome to your dashboard, {session?.user?.name}!</h1>}
      <Link
          href="/dashboard/bpmn"
          className={cn(
            buttonVariants({ variant: "destructive" }),
            "top-[69px] float-right absolute right-4"
          )}
        >
           <CirclePlusIcon />&nbsp; New Workflow
        </Link>

      <Table>
        <TableCaption>A list of your workflows.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Name</TableHead>
            <TableHead className="w-2/4">Prompt</TableHead>
            <TableHead className="w-1/4 text-right">Workflow</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {workflows&&workflows.map((workflow, index) => (
            <TableRow key={index} className='mb-2 h-fill'>
              <TableCell className="font-medium">{workflow.name} </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>{workflow.prompt.substring(0, 60) + "..."}</TooltipTrigger>
                    <TooltipContent>
                      <p dangerouslySetInnerHTML={{ __html: workflow.prompt.replaceAll("\n", "<br />") }} />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>

              <TableCell className="p-0">

              <ToogleWorkflowItem workflow={workflow} />
              <Button 
                  onClick={() => {
                    "use client";
                    const isConfirmed = window.confirm("Are you sure you want to delete this workflow?");
                    if (isConfirmed) {
                    //delete the workflow
                    fetch("/api/workflows/mine", {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ id: workflow.id }),
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        console.log(data);
                        //remove the workflow from the list
                        setWorkflows(workflows.filter((w) => w.id !== workflow.id));
                      });
                      }
                    }}
                  variant="destructive"className="mr-2 mb-2" ><Trash2Icon /></Button>
              <Button
                  onClick={() => {
                    //download the bpmn file from content of workflow.workflow
                    const element = document.createElement("a");
                    const file = new Blob([workflow.workflow], { type: 'text/plain' });
                    element.href = URL.createObjectURL(file);
                    element.download = workflow.name + ".bpmn";
                    document.body.appendChild(element); // Required for this to work in FireFox
                    element.click();
                  }} 
                  variant="default" className="mr-2 mb-2">
                <FileDownIcon />
                </Button>
              
              {previewBPMN(workflow.workflow, index)}
              </TableCell>
            </TableRow>))
          }
        </TableBody>
      </Table>
      <Pagination totalPages={totalPages} currentPage={page} setCurrentPage={setCurrentPage} />
    </div>
  );
}

