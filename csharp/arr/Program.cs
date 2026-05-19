using System;
using System.Security;

class ArrProgram{
    static void Main(){

        //set values to an array
        string[] motorcycles = {
            "Yamaha", "Suzuki", "Aprillia", "Honda", "Kawasaki", "Ducati", "BMW", "KTM", "Triumph", "Harley-Davidson"
        };

//choose a value from the array
        Console.WriteLine("The first motorcycle is: " );
        Console.WriteLine(motorcycles[0]);

        
        Console.WriteLine();


        /*Console.WriteLine("list of all my favorite motorcycles: " );
        for(int m=0; m<motorcycles.Length; m++){
            Console.WriteLine(motorcycles[m]);
        };*/

        //or whenever you don't care about indexes and positions
        foreach(string motorcycle in motorcycles){
            Console.WriteLine(motorcycle);
        }

        Console.WriteLine();

        Console.WriteLine("Total");
        Console.WriteLine(motorcycles.Length);

    }
}

