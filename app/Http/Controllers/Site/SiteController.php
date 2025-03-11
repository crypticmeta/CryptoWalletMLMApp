<?php

namespace App\Http\Controllers\Site;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\member\ClientProfile;
use App\Models\member\ClientWithdrawal;
use App\Models\member\ClubBoosting1;
use App\Models\member\ClientInvestment;
use App\Models\member\MemberProfile;
use App\Models\member\NewsAndEvent;
use App\Models\member\ClientPayout;
use App\Models\member\MasterProduct;
use App\Models\member\MasterCompanyAccount;
use App\Models\member\ClientAchievers;
use App\Models\member\ClientDirector;
use App\Models\Site\CmsFaqModel as Faqs;
use App\Models\member\ClientTransactions;
use Carbon\Carbon;
use App\Services\SiteService;

class SiteController extends Controller
{
    public function __construct()
    {
        $this->SiteService = new SiteService();
    }

    public function Report(){
        return view('Site.report');
    }

    public function siteReport(Request $request){
      return view('Site.report', $this->SiteService->SiteReportData($request));   
    }

    public function Index(){
      return view('Site.index',$this->SiteService->SiteIndexData()); 
     }

    public function AboutUs(){
      $dData = ClientDirector::where('is_status', 1)
      ->where('is_live', 1)->get();
        return view('Site.about-us',['dData'=>$dData]);
    }

    public function ContactUs(){

      
   
        return view('Site.contact-us');
    }

    /* Contact Details Insert Start */    
    public function ContactDetails(Request $request){
          return redirect()->route('contact-us',$this->SiteService->SiteContact($request)); 
    }

    /* Contact Details Insert End */
    public function Features(){
        return view('Site.features');
    }

    public function FAQ(){
      return view('Site.FAQ',$this->SiteService->Faqs()); 
    }

    public function BlogList(){
      return view('Site.blog-list',$this->SiteService->BlogListData()); 
    }

    public function BlogDetais($id){
      return view('Site.blogDetails',$this->SiteService->BlogDetailData()); 
    }
}
