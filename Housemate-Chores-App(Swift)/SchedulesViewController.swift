//
//  SchedulesViewController.swift
//  Home-Ease
//
//  Created by Jack Cho on 12/10/20.
//  Copyright © 2020 Dhruv Patel. All rights reserved.
//

import UIKit
import FirebaseDatabase
import FirebaseAuth
import FirebaseFirestore

//using "FSCalendar" by WenchaoD via cocoapod
//https://github.com/WenchaoD/FSCalendar
import FSCalendar

class SchedulesViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    var ref : DatabaseReference? = nil
    
    var userFirstName: String = ""
    
    var userGroup: String = ""
    
    var arrayOfEvents : [[String]] = []
    
    var fireArray = [[String]]()
    
    
    fileprivate weak var calendar: FSCalendar!
    
    //"yyyy-MM-dd" of the date tapped
    var dateSelected : String?
    
    @IBOutlet weak var eventTableView: UITableView!
    
    
    //using alert and action to add cells to table view
    //reference: https://www.youtube.com/watch?v=Wu5l4e5uW4w&ab_channel=KiloLoco
    @IBAction func add(_ sender: Any) {
        
        if dateSelected == nil{
            //don't add anything when no date is selected
            return
        }
        var newEvent = ["",""]
        let alert = UIAlertController(title: "Add Event", message: nil, preferredStyle: .alert)
        alert.addTextField { (eventTF) in
            eventTF.placeholder = "Enter Event"
        }
        let action = UIAlertAction(title: "Add", style: .default) { (_) in
            guard let event = alert.textFields?.first?.text
                else {
                    return
            }
            if event == ""{
                //if user doesnt enter any event in the text field
                return
            }
            var whitespaceCount = 0
            for char in event{
                if(char.isWhitespace){
                    whitespaceCount = whitespaceCount + 1
                }
            }
            if event.count == whitespaceCount{
                return
            }
            
            newEvent[0] = self.dateSelected ?? "2021-01-01"
            newEvent[1] = self.userFirstName + ": " + event
            //event decription
            let object : [String: Any] = [
                "0": newEvent[0] ,
                "1" :  newEvent[1]
            ]
            self.ref?.childByAutoId().setValue(object)
            
            self.arrayOfEvents.append(newEvent)
            //append this new event data into data pool
            
            self.calendar.reloadData()
            self.arrayForTableView.append(newEvent[1])
            self.eventTableView.reloadData()
        }
        alert.addAction(action)
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: { action in
            return
        }
        ))
        present(alert, animated: true)
    }
    
    
    var arrayForTableView: [String?] = []
    //this only contains the event description of an event. (for the selected date)
    //need to find out how to remove/add items in this array AND remove/add item in arrayOfEvents->DONE!
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        arrayForTableView.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "eventCell")! as UITableViewCell
        cell.textLabel?.text = arrayForTableView[indexPath.row]
        cell.backgroundColor = UIColor.systemGray6
        return cell
    }
    
    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        let cell = tableView.cellForRow(at: indexPath)
        if editingStyle == .delete{
            
            let deleteAlert = UIAlertController(title: "Delete Event?", message: nil, preferredStyle: .alert)
            let deleteAction = UIAlertAction(title: "Delete", style: .default) { (_) in
                
                for index in 0..<self.arrayOfEvents.count{
                    //iterate through all the events, and look for entry that matches the event description and the date of the event to be deleted
                    //and remove that event from data pool
                    if (self.arrayOfEvents[index][0] == self.dateSelected &&
                        self.arrayOfEvents[index][1] == cell?.textLabel?.text){
                        self.arrayOfEvents.remove(at: index)
                        break
                    }
                }
                self.calendar.reloadData()
                self.arrayForTableView.remove(at: indexPath.row)
                self.eventTableView.deleteRows(at: [indexPath], with: .none)
                
                //remove data from firebase:
                self.ref?.observeSingleEvent(of: .value, with: { (snapshot) in
                    let dictionaryForDelete = snapshot.value! as! Dictionary<String, [String]>
                    if snapshot.childrenCount > 0 {
                        for (key,value) in dictionaryForDelete {
                            if (value[0] == self.dateSelected  && value[1] == cell?.textLabel?.text){
                                self.ref?.child(key).removeValue()
                            }
                        }
                    }
                }) { (error) in
                    print(error.localizedDescription)
                }
            }
            deleteAlert.addAction(deleteAction)
            deleteAlert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: { action in
                return
            }
                )
            )
            present(deleteAlert, animated: true)
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let calendar = FSCalendar(frame: CGRect(x: 17, y: 100, width: 343, height: 290))
        calendar.dataSource = self
        calendar.delegate = self
        view.addSubview(calendar)
        self.calendar = calendar
        calendar.backgroundColor = UIColor.systemGray6
        eventTableView.register(UITableViewCell.self, forCellReuseIdentifier: "eventCell")
        eventTableView.dataSource = self
        eventTableView.reloadData()
        eventTableView.layer.cornerRadius = 10.0
        calendar.layer.cornerRadius = 10.0
        
        eventTableView.backgroundColor = UIColor.systemGray5
        
        let today = dateFormatter2.string(from: calendar.today!)
        
        //display today's event as view loads
        for index in 0..<arrayOfEvents.count{
            if arrayOfEvents[index][0] == (today){
                self.arrayForTableView.append(arrayOfEvents[index][1])
                self.eventTableView.reloadData()
            }
        }
        
        
        let email = Auth.auth().currentUser?.email
        let docRef = Firestore.firestore().collection("users").document(email ?? "")
        docRef.getDocument { (document, error) in
            if let document = document, document.exists {
            } else {
                    print("Document does not exist")
            }
            
            self.userFirstName = document?.data()!["firstName"] as! String
            self.userGroup = document?.data()!["group"] as! String
            self.ref = Database.database().reference().child(self.userGroup)
            self.ref?.observe(.value, with: {
                snapshot in
                
                if snapshot.childrenCount > 0 {
                    
                    let someData = snapshot.value! as! Dictionary<String, [String]>
                    
                    //iterate though key and value in the dictionary
                    for (_,value) in someData {
                        self.fireArray.append(value)
                    }
                    self.arrayOfEvents = self.fireArray
                    self.calendar.reloadData()
                    self.fireArray = []
                }
            })
            
            
        }
    }
}  //end of scope for class SchedulesViewController

//creating secondary dateFormatter with fixed date format
//reference: https://stackoverflow.com/questions/37874349/how-to-add-events-to-fscalendar-swift
fileprivate var dateFormatter2: DateFormatter = {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd"
    return formatter
}()

extension SchedulesViewController: FSCalendarDataSource, FSCalendarDelegate{
    
    //dots
    func calendar(_ calendar: FSCalendar, numberOfEventsFor date: Date) -> Int {
        let dateString = dateFormatter2.string(from: date)
        for index in 0..<arrayOfEvents.count{
            if arrayOfEvents[index].contains(dateString){
                return 1
            }
        }
        return 0
    }
    
    
    //call this function when user taps on the date
    func calendar(_ calendar: FSCalendar, didSelect date: Date, at monthPosition: FSCalendarMonthPosition) {
        let dateString = dateFormatter2.string(from: date)
        dateSelected = dateString
        self.arrayForTableView = [] //empty this array for table view
        self.eventTableView.reloadData()
        //as the tableview reloads, array for tableview is refreshed
        for index in 0..<arrayOfEvents.count{
            if arrayOfEvents[index][0] == (dateString){
                self.arrayForTableView.append(arrayOfEvents[index][1])
                self.eventTableView.reloadData()
            }
        }
    }
}



